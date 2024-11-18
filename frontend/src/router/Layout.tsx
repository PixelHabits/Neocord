import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../components/Navigation/Navigation.tsx';
import { Modal, ModalProvider } from '../context/Modal.tsx';
import { useStore } from '../store/store.ts';

export function Layout() {
	const authenticate = useStore((state) => state.authenticate);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		authenticate().then(() => setIsLoaded(true));
	}, [authenticate]);

	return (
		<div className='flex h-full flex-col overflow-hidden'>
			<ModalProvider>
				<Navigation />
				{isLoaded && (
					<div className='flex-1 overflow-hidden'>
						<Outlet />
					</div>
				)}
				<Modal />
			</ModalProvider>
		</div>
	);
}
