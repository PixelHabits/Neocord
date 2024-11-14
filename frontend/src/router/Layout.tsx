import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store/store.ts';
import { ModalProvider, Modal } from '../context/Modal.tsx';
import { Navigation } from '../components/Navigation/Navigation.tsx';

export function Layout() {
	const authenticate = useStore((state) => state.authenticate);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		authenticate().then(() => setIsLoaded(true));
	}, [authenticate]);

	return (
		<>
			<ModalProvider>
				<Navigation />
				{isLoaded && <Outlet />}
				<Modal />
			</ModalProvider>
		</>
	);
}