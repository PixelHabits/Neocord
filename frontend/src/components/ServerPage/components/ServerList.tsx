import { BiPlusCircle } from 'react-icons/bi';

function getInitials(serverName: string) {
	const titleArr = serverName.split(' ');
	return titleArr.map((title) => title[0].toUpperCase()).join('');
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
		<aside className='flex flex-col items-center px-4 gap-4 relative'>
			{/* TODO: Add server tooltips (to be implemented later) */}
			{servers.map((server) => (
				<div
					key={server.id}
					className='rounded-full bg-gray-500 h-16 w-16 flex justify-center p-1 items-center cursor-pointer'
					onClick={() => alert(`Navigating to ${server.name}`)}
				>
					<span className='font-bold text-gray-200'>
						{getInitials(server.name)}
					</span>
				</div>
			))}
			<div className='w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-4xl text-gray-400 mb-4 cursor-pointer absolute bottom-0'>
				<BiPlusCircle size={48} />
			</div>
		</aside>
	);
};
