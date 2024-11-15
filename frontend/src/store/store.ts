import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
	type ChannelsSlice,
	createChannelsSlice,
} from './slices/channelsSlice.ts';
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
	MessagesSlice;

export const useStore = create<StoreState>()(
	devtools(
		persist(
			(...a) => ({
				...createSessionSlice(...a),
				...createServersSlice(...a),
				...createChannelsSlice(...a),
				...createMessagesSlice(...a),
			}),
			{
				name: 'app-storage',
				partialize: (state) => ({
					user: state.user,
					currentServer: state.currentServer,
					currentChannel: state.currentChannel,
					currentMessage: state.currentMessage,
				}),
			},
		),
		{
			name: 'app-store',
			enabled: process.env.NODE_ENV === 'development',
		},
	),
);
