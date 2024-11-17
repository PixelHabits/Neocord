import type { StateCreator, StoreApi } from 'zustand';
import type {
	ApiError,
	SessionActions,
	SessionState,
	StoreState,
	User,
} from '../../types/index.ts';

interface SessionSliceState extends SessionState, SessionActions {}

interface LoginCredentials {
	email: string;
	password: string;
}

interface SignupData {
	email: string;
	username: string;
	password: string;
}

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
			const data = (await response.json()) as User;
			if (!('errors' in data)) {
				set({ user: data }, false, 'session/authenticate');
			}
		}
	},

	login: async (
		credentials: LoginCredentials,
	): Promise<ApiError | undefined> => {
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
			const data = (await response.json()) as User;
			set({ user: data }, false, 'session/login');
			return undefined;
		}

		if (response.status < 500) {
			const errorData = (await response.json()) as ApiError;
			return errorData;
		}

		return {
			errors: {
				message: 'Something went wrong. Please try again',
			},
		} as ApiError;
	},

	signup: async (userData: SignupData): Promise<ApiError | undefined> => {
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': store.getState().csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify(userData),
		});

		if (response.ok) {
			const data = (await response.json()) as User;
			set({ user: data }, false, 'session/signup');
			return undefined;
		}

		if (response.status < 500) {
			const errorData = (await response.json()) as ApiError;
			return errorData;
		}

		return {
			errors: {
				message: 'Something went wrong. Please try again',
			},
		};
	},

	logout: async (): Promise<boolean> => {
		const response = await fetch('/api/auth/logout', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-CSRFToken': store.getState().csrfToken,
			},
		});

		if (!response.ok) {
			return false;
		}

		set({ user: null }, false, 'session/logout');
		store.getState().reset();

		await store.getState().initializeCsrfToken();
		return true;
	},
});
