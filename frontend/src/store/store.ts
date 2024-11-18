import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StoreState } from '../types/index.ts';
import { createChannelsSlice } from './slices/channelsSlice.ts';
import { createCsrfSlice } from './slices/csrfSlice.ts';
import { createMessagesSlice } from './slices/messagesSlice.ts';
import { createServersSlice } from './slices/serversSlice.ts';
import { createSessionSlice } from './slices/sessionSlice.ts';

type StateValues = Pick<
	StoreState,
	| 'user'
	| 'csrfToken'
	| 'servers'
	| 'currentServer'
	| 'currentChannel'
	| 'messages'
	| 'threads'
	| 'currentMessage'
	| 'currentThread'
>;

// Initial state values only
const initialStateValues: StateValues = {
	user: null,
	csrfToken: '',
	servers: [],
	currentServer: null,
	currentChannel: null,
	messages: {},
	threads: {},
	currentMessage: null,
	currentThread: null,
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
					set(
						(state) => ({
							...state,
							...initialStateValues,
						}),
						true,
						'store/reset',
					);
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
