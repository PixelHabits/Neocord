import { BiPlusCircle } from 'react-icons/bi';

function getInitials(serverName: string) {
	const titleArr = serverName.split(' ');
	return titleArr.map((title) => title.charAt(0)?.toUpperCase() || '').join('');
}
// Added so that typescript doesn't complain
export interface Server {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

interface ServerProps {
	servers: Server[];
}

export const ServerList = ({ servers }: ServerProps) => {
	return (
		<aside className='relative flex flex-col items-center gap-4 px-4'>
			{/* TODO: Add server tooltips (to be implemented later) */}
			{servers.map((server) => (
				<button
					type='button'
					key={server.id}
					className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-500 p-1'
					onClick={() => alert(`Navigating to ${server.name}`)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							alert(`Navigating to ${server.name}`);
						}
					}}
					tabIndex={0}
				>
					<span className='font-bold text-gray-200'>
						{getInitials(server.name)}
					</span>
				</button>
			))}
			<div className='absolute bottom-0 mb-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-gray-700 text-4xl text-gray-400'>
				<BiPlusCircle size={48} />
			</div>
		</aside>
	);
};
