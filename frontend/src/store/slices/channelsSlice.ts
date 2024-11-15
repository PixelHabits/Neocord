import type { StateCreator } from 'zustand';
import type { Channel } from '../../types/index.ts';
import type { ServersSlice } from './serversSlice.ts';
import { getCsrfToken } from '../csrf.ts';
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
	deleteChannel: (channelId: number) => Promise<void>;
	setCurrentChannel: (channel: Channel | null) => void;
}

export type ChannelsSlice = ChannelsState & ChannelsActions;

export const createChannelsSlice: StateCreator<
	ChannelsSlice & ServersSlice,
	[['zustand/devtools', never]],
	[],
	ChannelsSlice
> = (set, _get, store) => ({
	currentChannel: null,

	createChannel: async (serverId, channelData) => {
		const response = await fetch(`/api/servers/${serverId}/channels`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(channelData),
		});

		if (response.ok) {
			const newChannel = await response.json();
			const serverStore = store as unknown as ServersSlice;
			await serverStore.getServer(serverId);

			set({ currentChannel: newChannel }, false, 'channels/createChannel');
		} else if (response.status < 500) {
			return await response.json();
		}
		return { server: 'Something went wrong. Please try again' };
	},

	updateChannel: async (channelId, updates) => {
		const response = await fetch(`/api/channels/${channelId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(updates),
		});

		if (response.ok) {
			const updatedChannel = await response.json();
			const serverStore = store as unknown as ServersSlice;
			if (serverStore.currentServer) {
				await serverStore.getServer(serverStore.currentServer.id);
			}

			set(
				(state) => ({
					currentChannel:
						state.currentChannel?.id === channelId
							? updatedChannel
							: state.currentChannel,
				}),
				false,
				'channels/updateChannel',
			);
		} else if (response.status < 500) {
			return await response.json();
		}
		return { server: 'Something went wrong. Please try again' };
	},

	deleteChannel: async (channelId) => {
		const response = await fetch(`/api/channels/${channelId}`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
		});

		if (response.ok) {
			const serverStore = store as unknown as ServersSlice;
			if (serverStore.currentServer) {
				await serverStore.getServer(serverStore.currentServer.id);
			}

			set(
				(state) => ({
					currentChannel:
						state.currentChannel?.id === channelId
							? null
							: state.currentChannel,
				}),
				false,
				'channels/deleteChannel',
			);
		}
	},

	setCurrentChannel: (channel) => {
		set({ currentChannel: channel }, false, 'channels/setCurrentChannel');
	},
});

/*
Example of how to use this state slice:

Access channels from current server:

const channels = useStore(state => state.currentServer?.channels ?? []);

Access/modify current channel:

const currentChannel = useStore(state => state.currentChannel);
const setCurrentChannel = useStore(state => state.setCurrentChannel);



*/
