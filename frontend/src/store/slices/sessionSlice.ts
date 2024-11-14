import type { StateCreator } from 'zustand';

interface User {
	id: number;
	email: string;
	username: string;
	// Add other user properties as needed
}

export interface SessionState {
	user: User | null;
}

export interface SessionActions {
	authenticate: () => Promise<void>;
	login: (credentials: { email: string; password: string }) => Promise<
		Record<string, string> | undefined
	>;
	signup: (user: {
		email: string;
		password: string;
		username: string;
	}) => Promise<Record<string, string> | undefined>;
	logout: () => Promise<void>;
}

export type SessionSlice = SessionState & SessionActions;

export const createSessionSlice: StateCreator<
	SessionSlice,
	[['zustand/devtools', never]],
	[],
	SessionSlice
> = (set) => ({
	user: null,

	authenticate: async () => {
		const response = await fetch('/api/auth/');
		if (response.ok) {
			const data = await response.json();
			if (!data.errors) {
				set({ user: data }, false, 'session/authenticate');
			}
		}
	},

	login: async (credentials) => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		});

		if (response.ok) {
			const data = await response.json();
			set({ user: data }, false, 'session/login');
		} else if (response.status < 500) {
			return response.json();
		}
		return { server: 'Something went wrong. Please try again' };
	},

	signup: async (user) => {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user),
		});

		if (response.ok) {
			const data = await response.json();
			set({ user: data }, false, 'session/signup');
		} else if (response.status < 500) {
			return response.json();
		}
		return { server: 'Something went wrong. Please try again' };
	},

	logout: async () => {
		await fetch('/api/auth/logout');
		set({ user: null }, false, 'session/logout');
	},
});