import type { Server } from '../ServerPage/components/ServerList.tsx';
import { channels } from '../ServerPage/mockServers.ts';

// Added so that typescript doesn't complain
export interface Channel {
	id: number;
	name: string;
	serverId: number;
	visibility: 'public' | 'private';
}

export const ChannelList = ({ server }: { server: Server }) => {
	return (
		<section className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-lg bg-gray-600'>
			<h2 className='p-4 font-bold text-xl '>Channels</h2>
			<div className='space-y-3 p-2'>
				{channels
					.filter((ch) => ch.serverId === server.id)
					.map((channel: Channel) => (
						<div
							className='cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-purple-800 hover:text-white'
							key={channel.id}
						>
							#{channel.name}
						</div>
					))}
			</div>
			<footer className='relative bottom-0 mt-4 bg-neutral-800 px-2 py-4 text-white'>
				user input goes here
			</footer>
		</section>
	);
};
