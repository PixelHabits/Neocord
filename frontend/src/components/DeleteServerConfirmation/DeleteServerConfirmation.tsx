import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../../context/useModal.ts';
import { servers } from '../ServerPage/mockServers.ts';

export const DeleteServerConfirmation = () => {
	const { closeModal } = useModal();
	const { serverId } = useParams();
	const navigate = useNavigate();

	const handleDelete = () => {
		// Find server index
		const serverIndex = servers.findIndex(
			(server) => server.id === Number(serverId),
		);

		// Remove server from array
		if (serverIndex !== -1) {
			servers.splice(serverIndex, 1);
		}

		// Close modal and navigate to first server (or home if no servers)
		closeModal();
		if (servers.length > 0) {
			navigate(`/servers/${servers[0].id}`);
		} else {
			navigate('/');
		}
	};

	return (
		<div className='flex flex-col gap-4 rounded-md bg-background p-4'>
			<h1 className='font-bold text-2xl text-gray-200'>
				Confirm Delete Server?
			</h1>
			<p className='text-gray-400'>
				Are you sure you want to delete this server? This action cannot be
				undone.
			</p>
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