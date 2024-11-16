import type { StateCreator } from 'zustand';
import type { Message, Thread } from '../../types/index.ts';
import { getCsrfToken } from '../csrf.ts';
import type { ChannelsSlice } from './channelsSlice.ts';
import type { ServersSlice } from './serversSlice.ts';

export interface MessagesState {
	messages: Record<number, Message[]>; // channelId -> messages[]
	threads: Record<number, Thread>; // messageId -> thread
	currentMessage: Message | null;
	currentThread: Thread | null;
}

export interface MessagesActions {
	getChannelMessages: (channelId: number) => Promise<void>;
	getMessage: (messageId: number) => Promise<void>;
	createMessage: (
		channelId: number,
		message: { body: string },
		parentMessageId?: number,
	) => Promise<Record<string, string> | undefined>;
	updateMessage: (
		messageId: number,
		updates: { body: string },
	) => Promise<Record<string, string> | undefined>;
	deleteMessage: (messageId: number) => Promise<void>;
	addReaction: (
		messageId: number,
		reaction: { emoji: string },
	) => Promise<Record<string, string> | undefined>;
	removeReaction: (messageId: number, reactionId: number) => Promise<void>;
	setCurrentMessage: (message: Message | null) => void;
	setCurrentThread: (thread: Thread | null) => void;
}

export type MessagesSlice = MessagesState & MessagesActions;

const updateMessageInState = (
	state: MessagesState,
	messageId: number,
	updater: (message: Message) => Message,
): Partial<MessagesState> => {
	const channelIdStr = Object.keys(state.messages).find((channelId) =>
		state.messages[Number(channelId)]?.some((msg) => msg.id === messageId),
	);

	if (!channelIdStr) return state;

	const channelId = Number(channelIdStr);
	const messages = state.messages[channelId];

	if (!messages) return state;

	return {
		messages: {
			...state.messages,
			[channelId]: messages.map((message) =>
				message.id === messageId ? updater(message) : message,
			),
		},
		currentMessage:
			state.currentMessage?.id === messageId
				? updater(state.currentMessage)
				: state.currentMessage,
	};
};

const getCreateMessageState = (
	state: MessagesState,
	channelId: number,
	newMessage: Message,
	parentMessageId?: number,
): Partial<MessagesState> => {
	if (parentMessageId && newMessage.thread) {
		const thread = newMessage.thread as Thread;
		return {
			threads: { ...state.threads, [parentMessageId]: thread },
			currentThread:
				state.currentThread?.id === thread.id ? thread : state.currentThread,
		};
	}

	return {
		messages: {
			...state.messages,
			[channelId]: [...(state.messages[channelId] || []), newMessage],
		},
	};
};

const getDeleteMessageState = (
	state: MessagesState,
	messageId: number,
): Partial<MessagesState> => ({
	currentMessage:
		state.currentMessage?.id === messageId ? null : state.currentMessage,
	threads: Object.fromEntries(
		Object.entries(state.threads).filter(([id]) => Number(id) !== messageId),
	),
	messages: Object.fromEntries(
		Object.entries(state.messages).map(([channelId, msgs]) => [
			channelId,
			msgs.filter((msg) => msg.id !== messageId),
		]),
	),
});

export const createMessagesSlice: StateCreator<
	MessagesSlice & ServersSlice & ChannelsSlice,
	[['zustand/devtools', never]],
	[],
	MessagesSlice
> = (set, get) => ({
	messages: {},
	threads: {},
	currentMessage: null,
	currentThread: null,

	getChannelMessages: async (channelId) => {
		const response = await fetch(`/api/channels/${channelId}/messages`, {
			credentials: 'include',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
		});

		if (response.ok) {
			const messages = await response.json();
			set(
				{ messages: { ...get().messages, [channelId]: messages } },
				false,
				'messages/getChannelMessages',
			);
		}
	},

	getMessage: async (messageId) => {
		const response = await fetch(`/api/messages/${messageId}`, {
			credentials: 'include',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
		});

		if (response.ok) {
			const message = await response.json();
			set(
				(state) => ({
					...updateMessageInState(state, messageId, () => message),
					currentMessage: message,
					currentThread: message.thread,
					threads: message.thread
						? { ...state.threads, [messageId]: message.thread }
						: state.threads,
				}),
				false,
				'messages/getMessage',
			);
		}
	},

	createMessage: async (channelId, messageData, parentMessageId) => {
		const url = `/api/channels/${channelId}/messages${parentMessageId ? `?parent_message_id=${parentMessageId}` : ''}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(messageData),
		});

		if (response.ok) {
			const newMessage = await response.json();
			set(
				(state) =>
					getCreateMessageState(state, channelId, newMessage, parentMessageId),
				false,
				'messages/createMessage',
			);
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	updateMessage: async (messageId, updates) => {
		const response = await fetch(`/api/messages/${messageId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(updates),
		});

		if (response.ok) {
			const updatedMessage = await response.json();
			set(
				(state) => updateMessageInState(state, messageId, () => updatedMessage),
				false,
				'messages/updateMessage',
			);
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	deleteMessage: async (messageId) => {
		const response = await fetch(`/api/messages/${messageId}`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
		});

		if (response.ok) {
			set(
				(state) => getDeleteMessageState(state, messageId),
				false,
				'messages/deleteMessage',
			);
		}
	},

	addReaction: async (messageId, reactionData) => {
		const response = await fetch(`/api/messages/${messageId}/reactions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(reactionData),
		});

		if (response.ok) {
			const newReaction = await response.json();
			set(
				(state) =>
					updateMessageInState(state, messageId, (message) => ({
						...message,
						reactions: message.reactions
							? [...message.reactions, newReaction]
							: [newReaction],
					})),
				false,
				'messages/addReaction',
			);
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	removeReaction: async (messageId, reactionId) => {
		const response = await fetch(
			`/api/messages/${messageId}/reactions/${reactionId}`,
			{
				method: 'DELETE',
				headers: {
					'X-CSRFToken': getCsrfToken(),
				},
				credentials: 'include',
			},
		);

		if (response.ok) {
			set(
				(state) =>
					updateMessageInState(state, messageId, (message) => ({
						...message,
						reactions: message.reactions
							? message.reactions.filter((r) => r.id !== reactionId)
							: [],
					})),
				false,
				'messages/removeReaction',
			);
		}
	},

	setCurrentMessage: (message) => {
		set({ currentMessage: message }, false, 'messages/setCurrentMessage');
	},

	setCurrentThread: (thread) => {
		set({ currentThread: thread }, false, 'messages/setCurrentThread');
	},
});

/*
Example of how to use the messages slice:
// Get messages for current channel
const messages = useStore(state => {
  const channelId = state.currentChannel?.id;
  return channelId ? state.messages[channelId] ?? [] : [];
});

// Get/set current message and thread
const currentMessage = useStore(state => state.currentMessage);
const currentThread = useStore(state => state.currentThread);
const setCurrentMessage = useStore(state => state.setCurrentMessage);
const setCurrentThread = useStore(state => state.setCurrentThread);

// Load messages for a channel
const getChannelMessages = useStore(state => state.getChannelMessages);
useEffect(() => {
  if (channelId) {
    getChannelMessages(channelId);
  }
}, [channelId]);

// Handle reactions
const addReaction = useStore(state => state.addReaction);
const removeReaction = useStore(state => state.removeReaction);
*/
