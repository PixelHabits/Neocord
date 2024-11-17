import type {
	BaseState,
	ChannelsActions,
	ChannelsSlice,
	ChannelsState,
	CsrfActions,
	CsrfSlice,
	CsrfState,
	MessagesActions,
	MessagesSlice,
	MessagesState,
	ServersActions,
	ServersSlice,
	ServersState,
	SessionActions,
	SessionSlice,
	SessionState,
	StoreState,
} from './state.ts';

// Domain models
export interface User {
	id: number;
	email: string;
	username: string;
}

export interface ServerMember {
	joinDate: string;
	user: User & {
		isOwner: boolean;
	};
}

export interface Channel {
	id: number;
	name: string;
	serverId: number;
	visibility: 'public' | 'private';
}

export interface Server {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface ServerDetails extends Server {
	channels: Channel[];
	members: ServerMember[];
	owner: User;
}

export interface Message {
	body: string;
	channelId: number;
	createdAt: string;
	id: number;
	reactions: Reaction[];
	replyCount: number;
	thread: Thread | null;
	updatedAt: string;
	userId: number;
	user?: User;
}

export interface Reaction {
	id: number;
	userId: number;
	messageId: number;
	emoji: string;
}

export interface Thread {
	id: number;
	messages: Message[];
	createdAt: string;
}

// API types
export interface ApiError {
	errors: {
		message: string;
		[key: string]: string;
	};
}

// Re-export store types explicitly
export type {
	BaseState,
	SessionState,
	SessionActions,
	SessionSlice,
	CsrfState,
	CsrfActions,
	CsrfSlice,
	ServersState,
	ServersActions,
	ServersSlice,
	ChannelsState,
	ChannelsActions,
	ChannelsSlice,
	MessagesState,
	MessagesActions,
	MessagesSlice,
	StoreState,
};
