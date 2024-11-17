import type { StateCreator, StoreApi } from 'zustand';
import type {
	SessionActions,
	SessionState,
	StoreState,
} from '../../types/index.ts';

interface SessionSliceState extends SessionState, SessionActions {}

export const createSessionSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never]],
	[],
	SessionSliceState
> = (set, _get, store: StoreApi<StoreState>) => ({
	user: null,

	authenticate: async () => {
		const response = await fetch('/api/auth/', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
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
				'X-CSRFToken': store.getState().csrfToken,
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
				'X-CSRFToken': store.getState().csrfToken,
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

	logout: async (navigate) => {
		await fetch('/api/auth/logout', {
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});
		store.getState().reset();
		navigate('/');
	},
});
