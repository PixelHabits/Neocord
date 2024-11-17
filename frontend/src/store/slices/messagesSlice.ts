import type { StateCreator, StoreApi } from 'zustand';
import type {
	ApiError,
	Message,
	MessagesActions,
	MessagesState,
	Reaction,
	StoreState,
} from '../../types/index.ts';

interface MessagesSliceState extends MessagesState, MessagesActions {}

// Helper functions for state updates
const updateMessageInState = (
	state: Pick<MessagesSliceState, 'messages' | 'currentMessage'>,
	messageId: number,
	updater: (message: Message) => Message,
): Partial<MessagesSliceState> => {
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
	state: Pick<MessagesSliceState, 'messages' | 'threads' | 'currentThread'>,
	channelId: number,
	newMessage: Message,
	parentMessageId?: number,
): Partial<MessagesSliceState> => {
	if (parentMessageId && newMessage.thread) {
		const thread = newMessage.thread;
		return {
			threads: { ...state.threads, [parentMessageId]: thread },
			currentThread:
				state.currentThread?.id === thread.id ? thread : state.currentThread,
		};
	}

	return {
		messages: {
			...state.messages,
			[channelId]: [...(state.messages[channelId] ?? []), newMessage],
		},
	};
};

const getDeleteMessageState = (
	state: Pick<MessagesSliceState, 'messages' | 'threads' | 'currentMessage'>,
	messageId: number,
): Partial<MessagesSliceState> => ({
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
	StoreState,
	[['zustand/devtools', never]],
	[],
	MessagesSliceState
> = (set, get, store: StoreApi<StoreState>) => ({
	messages: {},
	threads: {},
	currentMessage: null,
	currentThread: null,

	getChannelMessages: async (channelId) => {
		const response = await fetch(
			`/api/channels/${String(channelId)}/messages`,
			{
				credentials: 'include',
				headers: {
					'X-CSRFToken': store.getState().csrfToken,
				},
			},
		);

		if (response.ok) {
			const messages = (await response.json()) as Message[];
			set(
				{ messages: { ...get().messages, [channelId]: messages } },
				false,
				'messages/getChannelMessages',
			);
		}
	},

	getMessage: async (messageId) => {
		const response = await fetch(`/api/messages/${String(messageId)}`, {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});

		if (response.ok) {
			const message = (await response.json()) as Message;
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

	createMessage: async (
		channelId,
		messageData,
		parentMessageId,
	): Promise<ApiError | undefined> => {
		const url = `/api/channels/${String(channelId)}/messages${parentMessageId ? `?parent_message_id=${String(parentMessageId)}` : ''}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(messageData),
		});

		if (response.ok) {
			const newMessage = (await response.json()) as Message;
			set(
				(state) =>
					getCreateMessageState(state, channelId, newMessage, parentMessageId),
				false,
				'messages/createMessage',
			);
			return undefined;
		}

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	updateMessage: async (messageId, updates): Promise<ApiError | undefined> => {
		const response = await fetch(`/api/messages/${String(messageId)}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(updates),
		});

		if (response.ok) {
			const updatedMessage = (await response.json()) as Message;
			set(
				(state) => updateMessageInState(state, messageId, () => updatedMessage),
				false,
				'messages/updateMessage',
			);
			return undefined;
		}

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	deleteMessage: async (messageId) => {
		const response = await fetch(`/api/messages/${String(messageId)}`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
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

	addReaction: async (
		messageId,
		reactionData,
	): Promise<ApiError | undefined> => {
		const response = await fetch(
			`/api/messages/${String(messageId)}/reactions`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': store.getState().csrfToken,
				},
				credentials: 'include',
				body: JSON.stringify(reactionData),
			},
		);

		if (response.ok) {
			const newReaction = (await response.json()) as Reaction;
			set(
				(state) =>
					updateMessageInState(state, messageId, (message) => ({
						...message,
						reactions: [...message.reactions, newReaction],
					})),
				false,
				'messages/addReaction',
			);
			return undefined;
		}

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	removeReaction: async (messageId, reactionId) => {
		const response = await fetch(
			`/api/messages/${String(messageId)}/reactions/${String(reactionId)}`,
			{
				method: 'DELETE',
				headers: {
					'X-CSRFToken': store.getState().csrfToken,
				},
				credentials: 'include',
			},
		);

		if (response.ok) {
			set(
				(state) =>
					updateMessageInState(state, messageId, (message) => ({
						...message,
						reactions: message.reactions.filter((r) => r.id !== reactionId),
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
