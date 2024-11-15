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
	id: number;
	body: string;
	channelId: number;
	userId: number;
	createdAt: string;
	updatedAt: string;
	user?: User;
	reactions?: Reaction[];
	replyCount: number;
	thread?: {
		messages: Message[];
	} | null;
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
