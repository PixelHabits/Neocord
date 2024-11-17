import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ApiError, StoreState } from '../types/index.ts';
import { createChannelsSlice } from './slices/channelsSlice.ts';
import { createCsrfSlice } from './slices/csrfSlice.ts';
import { createMessagesSlice } from './slices/messagesSlice.ts';
import { createServersSlice } from './slices/serversSlice.ts';
import { createSessionSlice } from './slices/sessionSlice.ts';

// Complete initial state that matches StoreState interface
const initialState: StoreState = {
	// Session
	user: null,
	authenticate: () => Promise.resolve(),
	login: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	signup: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	logout: () => Promise.resolve(),

	// CSRF
	csrfToken: '',
	initializeCsrfToken: () => Promise.resolve(),
	refreshCsrfToken: () => Promise.resolve(),

	// Servers
	servers: [],
	currentServer: null,
	getServers: () => Promise.resolve(),
	getServer: () => Promise.resolve(),
	createServer: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	updateServer: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	deleteServer: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	joinServer: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	leaveServer: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	setCurrentServer: () => undefined,

	// Channels
	currentChannel: null,
	createChannel: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	updateChannel: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	deleteChannel: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	setCurrentChannel: () => undefined,

	// Messages
	messages: {},
	threads: {},
	currentMessage: null,
	currentThread: null,
	getChannelMessages: () => Promise.resolve(),
	getMessage: () => Promise.resolve(),
	createMessage: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	updateMessage: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	deleteMessage: () => Promise.resolve(),
	addReaction: () =>
		Promise.resolve({
			errors: { message: 'Not implemented' },
		} satisfies ApiError),
	removeReaction: () => Promise.resolve(),
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
				reset: () => {
					set(initialState, true, 'store/reset');
				},
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
