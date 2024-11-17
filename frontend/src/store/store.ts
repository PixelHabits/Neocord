import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StoreState } from '../types/index.ts';
import { createChannelsSlice } from './slices/channelsSlice.ts';
import { createCsrfSlice } from './slices/csrfSlice.ts';
import { createMessagesSlice } from './slices/messagesSlice.ts';
import { createServersSlice } from './slices/serversSlice.ts';
import { createSessionSlice } from './slices/sessionSlice.ts';

// Complete initial state that matches StoreState interface
const initialState: StoreState = {
	// Session
	user: null,
	authenticate: async () => undefined,
	login: async () => undefined,
	signup: async () => undefined,
	logout: async () => undefined,

	// CSRF
	csrfToken: '',
	initializeCsrfToken: async () => undefined,
	refreshCsrfToken: () => undefined,

	// Servers
	servers: [],
	currentServer: null,
	getServers: async () => undefined,
	getServer: async () => undefined,
	createServer: async () => undefined,
	updateServer: async () => undefined,
	deleteServer: async () => undefined,
	joinServer: async () => undefined,
	leaveServer: async () => undefined,
	setCurrentServer: () => undefined,

	// Channels
	currentChannel: null,
	createChannel: async () => undefined,
	updateChannel: async () => undefined,
	deleteChannel: async () => undefined,
	setCurrentChannel: () => undefined,

	// Messages
	messages: {},
	threads: {},
	currentMessage: null,
	currentThread: null,
	getChannelMessages: async () => undefined,
	getMessage: async () => undefined,
	createMessage: async () => undefined,
	updateMessage: async () => undefined,
	deleteMessage: async () => undefined,
	addReaction: async () => undefined,
	removeReaction: async () => undefined,
	setCurrentMessage: () => undefined,
	setCurrentThread: () => undefined,

	// Reset function
	reset: () => undefined,
};

export const useStore = create<StoreState>()(
	devtools(
		persist(
			(set, get, store) => ({
				...createSessionSlice(set, get, store),
				...createServersSlice(set, get, store),
				...createChannelsSlice(set, get, store),
				...createMessagesSlice(set, get, store),
				...createCsrfSlice(set, get, store),
				reset: () => set(initialState, true, 'store/reset'),
			}),
			{
				name: 'app-storage',
				partialize: (state) => ({
					user: state.user,
				}),
			},
		),
		{
			name: 'app-store',
			enabled: process.env.NODE_ENV === 'development',
		},
	),
);
