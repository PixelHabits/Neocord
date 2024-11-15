import { BiPlusCircle } from 'react-icons/bi';
import { servers } from '../mockServers';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

function getInitials(serverName: string) {
	const titleArr = serverName.split(' ');
	return titleArr.map((title) => title[0].toUpperCase()).join('');
}

export const ServerLayout = () => {
	const navigate = useNavigate();

	return (
		<div className='flex w-full h-[calc(100vh-6rem)]'>
			<aside className='flex flex-col items-center justify-between px-4 gap-4 relative'>
				{/* TODO: Add server tooltips (to be implemented later) */}
				<div className='flex flex-col gap-4'>
					{servers.map((server) => (
						<div
							key={server.id}
							className='rounded-full bg-gray-500 h-16 w-16 flex justify-center p-1 items-center cursor-pointer'
							onClick={() => navigate(`/servers/${server.id}`)}
						>
							<span className='font-bold text-gray-200'>
								{getInitials(server.name)}
							</span>
						</div>
					))}
				</div>
				<div className='w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-4xl text-gray-400  cursor-pointer '>
					<BiPlusCircle size={48} />
				</div>
			</aside>
			<Outlet />
		</div>
	);
};
