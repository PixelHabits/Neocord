import type { StateCreator } from 'zustand';
import type { CsrfActions, CsrfState, StoreState } from '../../types/index.ts';

interface CsrfSliceState extends CsrfState, CsrfActions {}

export const createCsrfSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never]],
	[],
	CsrfSliceState
> = (set, get) => ({
	csrfToken: '',

	initializeCsrfToken: async () => {
		const response = await fetch('/api/auth/csrf', {
			credentials: 'include',
		});

		if (response.ok) {
			const token = response.headers.get('X-CSRFToken') ?? '';
			set({ csrfToken: token }, false, 'csrf/initializeCsrfToken');

			// Create a non-async wrapper function with error handling
			const refreshToken = () => {
				get()
					.refreshCsrfToken()
					.catch(() => {
						// Handle any errors silently or log them if needed
						set({ csrfToken: '' }, false, 'csrf/refreshError');
					});
			};

			// Set up auto-refresh before token expires (50 minutes)
			setTimeout(refreshToken, 50 * 60 * 1000);
		}
	},

	refreshCsrfToken: async () => {
		set({ csrfToken: '' }, false, 'csrf/tokenExpired');
		await get().initializeCsrfToken();
	},
});
