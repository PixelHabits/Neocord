import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
	type ChannelsSlice,
	createChannelsSlice,
} from './slices/channelsSlice.ts';
import { type CsrfSlice, createCsrfSlice } from './slices/csrfSlice.ts';
import {
	type MessagesSlice,
	createMessagesSlice,
} from './slices/messagesSlice.ts';
import {
	type ServersSlice,
	createServersSlice,
} from './slices/serversSlice.ts';
import {
	type SessionSlice,
	createSessionSlice,
} from './slices/sessionSlice.ts';

export type StoreState = SessionSlice &
	ServersSlice &
	ChannelsSlice &
	MessagesSlice &
	CsrfSlice;

export const useStore = create<StoreState>()(
	devtools(
		persist(
			(...a) => ({
				...createSessionSlice(...a),
				...createServersSlice(...a),
				...createChannelsSlice(...a),
				...createMessagesSlice(...a),
				...createCsrfSlice(...a),
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
