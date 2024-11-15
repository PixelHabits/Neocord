export interface Channel {
	id: number;
	name: string;
	serverId: number;
	visibility: 'public' | 'private';
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

export interface User {
	id: number;
	username: string;
	email: string;
	isOwner?: boolean;
}

export interface Server {
	id: number;
	name: string;
	description: string;
	members?: ServerMember[];
	owner?: User;
	channels?: Channel[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ServerMember {
	user: User;
	joinDate: string;
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
