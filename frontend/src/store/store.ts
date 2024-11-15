import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
	type SessionSlice,
	createSessionSlice,
} from './slices/sessionSlice.ts';

export type StoreState = SessionSlice;

export const useStore = create<StoreState>()(
	devtools(
		persist(
			(...a) => ({
				...createSessionSlice(...a),
			}),
			{
				name: 'app-storage',
				partialize: (state) => ({
					user: state.user,
				}),
			},
		),
		{
			name: 'app-store',
			enabled: process.env.NODE_ENV === 'development',
		},
	),
);
