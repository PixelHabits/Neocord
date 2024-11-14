import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';
import { useStore } from './store/store.ts';
import './index.css';

declare global {
	interface Window {
		store: typeof useStore;
	}
}

// Debug store in development
if (import.meta.env.MODE !== 'production') {
	window.store = useStore;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);