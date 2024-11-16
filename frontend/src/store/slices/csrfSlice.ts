import type { StateCreator } from 'zustand';

export interface CsrfState {
	csrfToken: string;
}

export interface CsrfActions {
	initializeCsrfToken: () => Promise<void>;
	refreshCsrfToken: () => void;
}

export type CsrfSlice = CsrfState & CsrfActions;

export const createCsrfSlice: StateCreator<
	CsrfSlice,
	[['zustand/devtools', never]],
	[],
	CsrfSlice
> = (set, get) => ({
	csrfToken: '',

	initializeCsrfToken: async () => {
		const response = await fetch('/api/auth/csrf', {
			credentials: 'include',
		});

		if (response.ok) {
			const token = response.headers.get('X-CSRFToken') ?? '';
			set({ csrfToken: token }, false, 'csrf/initializeCsrfToken');

			// Set up auto-refresh before token expires (50 minutes)
			setTimeout(
				() => {
					get().refreshCsrfToken();
				},
				50 * 60 * 1000,
			); // 50 minutes
		}
	},

	refreshCsrfToken: async () => {
		set({ csrfToken: '' }, false, 'csrf/tokenExpired');
		await get().initializeCsrfToken();
	},
});
