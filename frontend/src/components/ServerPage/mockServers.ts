import type { Channel, Message, Server } from '../../types/index.ts';

export const servers: Server[] = [
	{
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		description: "Demo's server for general discussions",
		id: 1,
		name: "Demo's Server",
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
	},
	{
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		description: 'goonies never say die!',
		id: 2,
		name: 'the clubhouse',
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
	},
	{
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		description: "Marnie's server for gaming and fun",
		id: 3,
		name: "Marnie's Server",
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
	},
	{
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		description: "Bobbie's server for work and collaboration",
		id: 4,
		name: "Bobbie's Server",
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
	},
];

export const channels: Channel[] = [
	{
		id: 1,
		name: 'announcements',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 2,
		name: 'introductions',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 3,
		name: 'random',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 4,
		name: 'help',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 5,
		name: 'resources',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 6,
		name: 'projects',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 7,
		name: 'events',
		serverId: 1,
		visibility: 'public',
	},
	{
		id: 8,
		name: 'moderators-only',
		serverId: 1,
		visibility: 'private',
	},
	{
		id: 9,
		name: 'admin-announcements',
		serverId: 1,
		visibility: 'private',
	},
];

export const messages: Message[] = [
	{
		body: 'Hey everyone! Welcome to the channel! 👋',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 1,
		reactions: [],
		replyCount: 0,
		thread: {
			createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
			id: 1,
			messages: [],
		},
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 1,
	},
	{
		body: 'Thanks for having us here! Excited to be part of this community 😊',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 2,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 2,
	},
	{
		body: 'Could someone help me with a coding problem?',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 3,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 3,
	},
	{
		body: "Sure, what's the issue? Let's discuss it in a thread",
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 4,
		reactions: [],
		replyCount: 0,
		thread: {
			createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
			id: 1,
			messages: [],
		},
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 1,
	},
	{
		body: 'The weather is perfect today! ☀️',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 5,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 2,
	},
	{
		body: 'Anyone up for some gaming later? 🎮',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 6,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 3,
	},
	{
		body: 'Just finished an amazing book! 📚',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 7,
		reactions: [],
		replyCount: 0,
		thread: {
			createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
			id: 1,
			messages: [],
		},
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 1,
	},
	{
		body: "What's everyone working on this week? 💻",
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 8,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 2,
	},
	{
		body: "Don't forget about our meeting tomorrow! 📅",
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 9,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 3,
	},
	{
		body: 'Check out this cool article I found',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 10,
		reactions: [],
		replyCount: 0,
		thread: {
			createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
			id: 1,
			messages: [],
		},
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 1,
	},
	{
		body: "Who's going to the tech conference next month?",
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 11,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 2,
	},
	{
		body: 'I made some awesome progress on my project today! 🚀',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 12,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 3,
	},
	{
		body: 'Need some feedback on my latest design',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 13,
		reactions: [],
		replyCount: 0,
		thread: {
			createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
			id: 1,
			messages: [],
		},
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 1,
	},
	{
		body: 'Happy Friday everyone! 🎉',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 14,
		reactions: [
			{
				emoji: '📚',
				id: 29,
				messageId: 14,
				userId: 2,
			},
		],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 2,
	},
	{
		body: 'Remember to update your dependencies',
		channelId: 1,
		createdAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		id: 15,
		reactions: [],
		replyCount: 0,
		thread: null,
		updatedAt: 'Wed, 13 Nov 2024 21:08:24 GMT',
		userId: 3,
	},
];
