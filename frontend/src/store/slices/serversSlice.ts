import type { StateCreator, StoreApi } from 'zustand';
import type {
	StoreState,
	ServersState,
	ServersActions,
	Server,
} from '../../types/index.ts';

interface ServersSliceState extends ServersState, ServersActions {}

export const createServersSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never]],
	[],
	ServersSliceState
> = (set, get, store: StoreApi<StoreState>) => ({
	servers: [],
	currentServer: null,

	getServers: async () => {
		const response = await fetch('/api/servers/', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});

		if (response.ok) {
			const servers = await response.json();
			set({ servers }, false, 'servers/getServers');
		}
	},

	getServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}`, {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});

		if (response.ok) {
			const serverDetails = await response.json();
			set({ currentServer: serverDetails }, false, 'servers/getServer');
		}
	},

	createServer: async (serverData) => {
		const response = await fetch('/api/servers/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(serverData),
		});

		if (response.ok) {
			const newServerDetails = await response.json();

			// Fetch the complete server details after creation
			const serverResponse = await fetch(
				`/api/servers/${newServerDetails.id}`,
				{
					credentials: 'include',
					headers: {
						'X-CSRFToken': store.getState().csrfToken,
					},
				},
			);

			if (serverResponse.ok) {
				const fullServerDetails = await serverResponse.json();
				const newServer: Server = {
					id: fullServerDetails.id,
					name: fullServerDetails.name,
					description: fullServerDetails.description,
					createdAt: fullServerDetails.createdAt,
					updatedAt: fullServerDetails.updatedAt,
				};

				set(
					(state) => ({
						servers: [...state.servers, newServer],
						currentServer: fullServerDetails,
					}),
					false,
					'servers/createServer',
				);
				return undefined;
			}
		}

		const errorData = await response.json();
		return {
			server:
				errorData.errors?.message || 'Something went wrong. Please try again',
		};
	},

	updateServer: async (serverId, updates) => {
		const response = await fetch(`/api/servers/${serverId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(updates),
		});

		if (response.ok) {
			const updatedServerDetails = await response.json();
			const updatedServer: Server = {
				id: updatedServerDetails.id,
				name: updatedServerDetails.name,
				description: updatedServerDetails.description,
				createdAt: updatedServerDetails.createdAt,
				updatedAt: updatedServerDetails.updatedAt,
			};

			set(
				(state) => ({
					servers: state.servers.map((server) =>
						server.id === serverId ? updatedServer : server,
					),
					currentServer:
						state.currentServer?.id === serverId
							? updatedServerDetails
							: state.currentServer,
				}),
				false,
				'servers/updateServer',
			);
			return undefined;
		}

		const errorData = await response.json();
		return {
			server:
				errorData.errors?.message || 'Something went wrong. Please try again',
		};
	},

	deleteServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
		});

		if (response.ok) {
			set(
				(state) => ({
					servers: state.servers.filter((server) => server.id !== serverId),
					currentServer:
						state.currentServer?.id === serverId ? null : state.currentServer,
				}),
				false,
				'servers/deleteServer',
			);
			return undefined;
		}

		const errorData = await response.json();
		return {
			server:
				errorData.errors?.message || 'Something went wrong. Please try again',
		};
	},

	joinServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}/members`, {
			method: 'POST',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
		});

		if (response.ok) {
			await response.json();

			// Get the updated server details after joining
			await get().getServer(serverId);

			// Get the basic server info to add to servers list if not already present
			const serverResponse = await fetch(`/api/servers/${serverId}`, {
				credentials: 'include',
			});

			if (serverResponse.ok) {
				const serverDetails = await serverResponse.json();
				set(
					(state) => ({
						servers: state.servers.some((s) => s.id === serverId)
							? state.servers
							: [
									...state.servers,
									{
										id: serverDetails.id,
										name: serverDetails.name,
										description: serverDetails.description,
										createdAt: serverDetails.createdAt,
										updatedAt: serverDetails.updatedAt,
									},
								],
					}),
					false,
					'servers/joinServer',
				);
			}
			return undefined;
		}

		const errorData = await response.json();
		return {
			server:
				errorData.errors?.message || 'Something went wrong. Please try again',
		};
	},

	leaveServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}/members`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
		});

		if (response.ok) {
			set(
				(state) => ({
					servers: state.servers.filter((server) => server.id !== serverId),
					currentServer:
						state.currentServer?.id === serverId ? null : state.currentServer,
				}),
				false,
				'servers/leaveServer',
			);
			return undefined;
		}

		const errorData = await response.json();
		return {
			server:
				errorData.errors?.message || 'Something went wrong. Please try again',
		};
	},

	setCurrentServer: (server) => {
		set({ currentServer: server }, false, 'servers/setCurrentServer');
	},
});

/*
Example of how to use this state slice:

Access servers:

const servers = useStore(state => state.servers);

Access/modify current server:

const currentServer = useStore(state => state.currentServer);
const setCurrentServer = useStore(state => state.setCurrentServer);

Check if current user is owner:
const isOwner = currentServer?.members.some(
  member => member.user.isOwner && member.user.id === currentUserId
);
*/
