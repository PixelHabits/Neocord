import type { StateCreator } from 'zustand';
import type { Server, ServerDetails } from '../../types/index.ts';
import { getCsrfToken } from '../csrf.ts';
export interface ServersState {
	servers: Server[];
	currentServer: ServerDetails | null;
}

export interface ServersActions {
	getServers: () => Promise<void>;
	getServer: (serverId: number) => Promise<void>;
	createServer: (server: { name: string; description: string }) => Promise<
		Record<string, string> | undefined
	>;
	updateServer: (
		serverId: number,
		updates: { name?: string; description?: string },
	) => Promise<Record<string, string> | undefined>;
	deleteServer: (serverId: number) => Promise<void>;
	joinServer: (serverId: number) => Promise<Record<string, string> | undefined>;
	leaveServer: (serverId: number) => Promise<void>;
	setCurrentServer: (server: ServerDetails | null) => void;
}

export type ServersSlice = ServersState & ServersActions;

export const createServersSlice: StateCreator<
	ServersSlice,
	[['zustand/devtools', never]],
	[],
	ServersSlice
> = (set, get) => ({
	servers: [],
	currentServer: null,

	getServers: async () => {
		const response = await fetch('/api/servers/', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': getCsrfToken(),
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
				'X-CSRFToken': getCsrfToken(),
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
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(serverData),
		});

		if (response.ok) {
			const newServerDetails = await response.json();
			const newServer: Server = {
				id: newServerDetails.id,
				name: newServerDetails.name,
				description: newServerDetails.description,
				createdAt: newServerDetails.createdAt,
				updatedAt: newServerDetails.updatedAt,
			};

			set(
				(state) => ({
					servers: [...state.servers, newServer],
					currentServer: newServerDetails,
				}),
				false,
				'servers/createServer',
			);
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	updateServer: async (serverId, updates) => {
		const response = await fetch(`/api/servers/${serverId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
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
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	deleteServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': getCsrfToken(),
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
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	joinServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}/members`, {
			method: 'POST',
			headers: {
				'X-CSRFToken': getCsrfToken(),
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
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	leaveServer: async (serverId) => {
		const response = await fetch(`/api/servers/${serverId}/members`, {
			method: 'DELETE',
			headers: {
				'X-CSRFToken': getCsrfToken(),
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
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
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
