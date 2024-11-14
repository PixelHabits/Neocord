import { channels } from '../ServerPage/mockServers.ts';
import { Server } from '../ServerPage/components/ServerList.tsx';

// Added so that typescript doesn't complain
interface Channel {
	id: number;
	name: string;
	serverId: number;
}

export const ChannelList = ({ server }: { server: Server }) => {
	return (
		<section className='flex flex-col gap-4 rounded-tl-lg bg-gray-600 overflow-y-auto relative w-72 max-w-72'>
			<h2 className='text-xl font-bold  p-4 '>Channels</h2>
			<div className='space-y-3 p-2'>
				{channels
					.filter((ch) => ch.serverId === server.id)
					.map((channel: Channel) => (
						<div
							className='hover:bg-purple-800 hover:text-white  transition-colors px-2 py-1 rounded-md cursor-pointer'
							key={channel.id}
						>
							#{channel.name}
						</div>
					))}
			</div>
			<footer className='relative bottom-0 mt-4 bg-neutral-800 text-white py-4 px-2'>
				user input goes here
			</footer>
		</section>
	);
};
