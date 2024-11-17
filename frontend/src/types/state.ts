import type { NavigateFunction } from 'react-router-dom';
import type {
	User,
	Server,
	ServerDetails,
	Channel,
	Message,
	Thread,
} from './index.ts';

// Base State
export interface BaseState {
	reset: () => void;
}

// Session State & Actions
export interface SessionState {
	user: User | null;
}

export interface SessionActions {
	authenticate: () => Promise<void>;
	login: (credentials: {
		email: string;
		password: string;
	}) => Promise<Record<string, string> | undefined>;
	signup: (user: {
		email: string;
		password: string;
		username: string;
	}) => Promise<Record<string, string> | undefined>;
	logout: (navigate: NavigateFunction) => Promise<void>;
}

export interface SessionSlice extends SessionState, SessionActions {}

// CSRF State & Actions
export interface CsrfState {
	csrfToken: string;
}

export interface CsrfActions {
	initializeCsrfToken: () => Promise<void>;
	refreshCsrfToken: () => void;
}

export interface CsrfSlice extends CsrfState, CsrfActions {}

// Servers State & Actions
export interface ServersState {
	servers: Server[];
	currentServer: ServerDetails | null;
}

export interface ServersActions {
	getServers: () => Promise<void>;
	getServer: (serverId: number) => Promise<void>;
	createServer: (server: {
		name: string;
		description: string;
	}) => Promise<Record<string, string> | undefined>;
	updateServer: (
		serverId: number,
		updates: { name?: string; description?: string },
	) => Promise<Record<string, string> | undefined>;
	deleteServer: (
		serverId: number,
	) => Promise<Record<string, string> | undefined>;
	joinServer: (serverId: number) => Promise<Record<string, string> | undefined>;
	leaveServer: (
		serverId: number,
	) => Promise<Record<string, string> | undefined>;
	setCurrentServer: (server: ServerDetails | null) => void;
}

export interface ServersSlice extends ServersState, ServersActions {}

// Channels State & Actions
export interface ChannelsState {
	currentChannel: Channel | null;
}

export interface ChannelsActions {
	createChannel: (
		serverId: number,
		channel: { name: string; visibility: string },
	) => Promise<Record<string, string> | undefined>;
	updateChannel: (
		channelId: number,
		updates: { name?: string; visibility?: string },
	) => Promise<Record<string, string> | undefined>;
	deleteChannel: (
		channelId: number,
	) => Promise<Record<string, string> | undefined>;
	setCurrentChannel: (channel: Channel | null) => void;
}

export interface ChannelsSlice extends ChannelsState, ChannelsActions {}

// Messages State & Actions
export interface MessagesState {
	messages: Record<number, Message[]>;
	threads: Record<number, Thread>;
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

export interface MessagesSlice extends MessagesState, MessagesActions {}

// Complete Store State
export interface StoreState
	extends BaseState,
		SessionSlice,
		CsrfSlice,
		ServersSlice,
		ChannelsSlice,
		MessagesSlice {}
