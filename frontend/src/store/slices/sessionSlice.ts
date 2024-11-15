import type { StateCreator } from 'zustand';
import type { User } from '../../types/index.ts';

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

const getCsrfToken = (): string => {
	return (
		document.cookie
			.split('; ')
			.find((row) => row.startsWith('csrf_token='))
			?.split('=')[1] ?? ''
	);
};

export const createSessionSlice: StateCreator<
	SessionSlice,
	[['zustand/devtools', never]],
	[],
	SessionSlice
> = (set) => ({
	user: null,

	authenticate: async () => {
		const response = await fetch('/api/auth/', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
		});
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
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(credentials),
		});

		if (response.ok) {
			const data = await response.json();
			set({ user: data }, false, 'session/login');
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	signup: async (user) => {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCsrfToken(),
			},
			credentials: 'include',
			body: JSON.stringify(user),
		});

		if (response.ok) {
			const data = await response.json();
			set({ user: data }, false, 'session/signup');
		} else if (response.status < 500) {
			const errorMessages = await response.json();
			return errorMessages;
		} else {
			return { server: 'Something went wrong. Please try again' };
		}
	},

	logout: async () => {
		await fetch('/api/auth/logout', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
		});
		set({ user: null }, false, 'session/logout');
	},
});
