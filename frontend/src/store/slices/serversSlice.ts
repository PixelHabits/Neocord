import type { StateCreator, StoreApi } from 'zustand';
import type {
	ApiError,
	Server,
	ServerDetails,
	ServersActions,
	ServersState,
	StoreState,
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
			const servers = (await response.json()) as Server[];
			set({ servers }, false, 'servers/getServers');
		}
	},

	getServer: async (serverId) => {
		const response = await fetch(`/api/servers/${String(serverId)}`, {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});

		if (response.ok) {
			const serverDetails = (await response.json()) as ServerDetails;
			set({ currentServer: serverDetails }, false, 'servers/getServer');
		}
	},

	createServer: async (serverData): Promise<ApiError | undefined> => {
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
			const newServerDetails = (await response.json()) as ServerDetails;

			const serverResponse = await fetch(
				`/api/servers/${String(newServerDetails.id)}`,
				{
					credentials: 'include',
					headers: {
						'X-CSRFToken': store.getState().csrfToken,
					},
				},
			);

			if (serverResponse.ok) {
				const fullServerDetails =
					(await serverResponse.json()) as ServerDetails;
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

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	updateServer: async (serverId, updates): Promise<ApiError | undefined> => {
		const response = await fetch(`/api/servers/${String(serverId)}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(updates),
		});

		if (response.ok) {
			const updatedServerDetails = (await response.json()) as ServerDetails;
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

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	deleteServer: async (serverId): Promise<ApiError | undefined> => {
		const response = await fetch(`/api/servers/${String(serverId)}`, {
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

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	joinServer: async (serverId): Promise<ApiError | undefined> => {
		const response = await fetch(`/api/servers/${String(serverId)}/members`, {
			method: 'POST',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
		});

		if (response.ok) {
			// Get the updated server details after joining
			await get().getServer(serverId);

			// Get the basic server info to add to servers list if not already present
			const serverResponse = await fetch(`/api/servers/${String(serverId)}`, {
				credentials: 'include',
			});

			if (serverResponse.ok) {
				const serverDetails = (await serverResponse.json()) as ServerDetails;
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
				return undefined;
			}
		}

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
	},

	leaveServer: async (serverId): Promise<ApiError | undefined> => {
		const response = await fetch(`/api/servers/${String(serverId)}/members`, {
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

		const errorData = (await response.json()) as ApiError;
		return {
			errors: {
				message:
					errorData.errors.message || 'Something went wrong. Please try again',
			},
		} satisfies ApiError;
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
