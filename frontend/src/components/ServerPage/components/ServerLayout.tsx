import { useEffect } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import type { Server } from '../../../types/index.ts';
import { CreateServerForm } from '../../CreateServerForm/CreateServerForm.tsx';
import { OpenModalButton } from '../../OpenModalButton/OpenModalButton.tsx';
import { servers } from '../mockServers.ts';

function getInitials(serverName: string) {
	const titleArr = serverName.split(' ');
	return titleArr
		.map((title) => title?.charAt(0)?.toUpperCase() ?? '')
		.join('');
}

export const ServerLayout = () => {
	const { serverId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (serverId) {
			navigate(`/servers/${serverId}`);
		} else {
			navigate('/servers/servers[0].id');
		}
	}, [serverId, navigate]);

	return (
		<div className='flex h-[calc(100vh-6rem)] w-full'>
			<aside className='relative flex flex-col items-center justify-between gap-4 px-4'>
				{/* TODO: Add server tooltips (to be implemented later) */}
				<div className='flex flex-col gap-4'>
					{servers.map((server: Server) => (
						<button
							type='button'
							key={server.id}
							className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-500 p-1'
							onClick={() => navigate(`/servers/${server.id}`)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									navigate(`/servers/${server.id}`);
								}
							}}
							tabIndex={0}
						>
							<span className='font-bold text-gray-200'>
								{getInitials(server.name)}
							</span>
						</button>
					))}
				</div>
				<OpenModalButton
					modalComponent={<CreateServerForm />}
					buttonText={<BiPlusCircle size={48} />}
					className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-gray-700 text-4xl text-gray-400'
				/>
			</aside>

			{/* Render the information for the selected server (channels, messages within the channels, and the sidebar) */}
			<Outlet />
		</div>
	);
};
