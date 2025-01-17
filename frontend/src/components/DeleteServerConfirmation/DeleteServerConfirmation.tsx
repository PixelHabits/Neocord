import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';

export const DeleteServerConfirmation = ({
	onCloseSettings,
}: { onCloseSettings: () => void }) => {
	const { closeModal } = useModal();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});
	const { deleteServer, servers, currentServer } = useStore();

	// Destructure errors for cleaner JSX
	const { message } = errors.errors;

	const handleDelete = async () => {
		if (!currentServer) return;

		setErrors({ errors: { message: '' } });
		setIsLoading(true);

		const serverResponse = await deleteServer(currentServer.id);

		if (serverResponse) {
			setErrors(serverResponse);
			setIsLoading(false);
			return;
		}

		// Only proceed with navigation if delete was successful
		closeModal();
		onCloseSettings();
		const nextServer = servers.find((server) => server.id !== currentServer.id);
		if (nextServer) {
			navigate(`/servers/${String(nextServer.id)}`);
		} else {
			navigate('/');
		}
		setIsLoading(false);
	};

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	return (
		<div className='flex flex-col gap-4 rounded-md bg-background p-4'>
			<h1 className='font-bold text-2xl text-gray-200'>
				Confirm Delete Server?
			</h1>
			<p className='text-gray-400'>
				Are you sure you want to delete this server? This action cannot be
				undone.
			</p>
			{message && <p className='text-red-500 text-sm'>{message}</p>}
			<div className='flex justify-end gap-2'>
				<button
					type='button'
					className='cursor-pointer rounded-md bg-gray-700 p-2 text-gray-200'
					onClick={closeModal}
				>
					Cancel
				</button>
				<button
					type='button'
					className='cursor-pointer rounded-md bg-red-500 p-2 text-white'
					onClick={handleDelete}
				>
					Delete
				</button>
			</div>
		</div>
	);
};
