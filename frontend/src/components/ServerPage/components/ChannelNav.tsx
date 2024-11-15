import { useEffect, useState } from 'react';
import type { Channel, Server } from '../../../types/index.ts';
import { channels } from '../mockServers.ts';

export const ChannelNav = ({
	server,
	onShowSettings,
}: { server: Server; onShowSettings: () => void }) => {
	const [serverChannels, setServerChannels] = useState<Channel[]>([]);

	useEffect(() => {
		if (server) {
			const filteredChannels = channels.filter(
				(ch) => ch.serverId === server.id,
			);

			if (filteredChannels.length > 0) {
				setServerChannels(filteredChannels);
			}
		}
	}, [server]);

	if (!server) {
		<section className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-lg bg-gray-600'>
			<h2 className='p-4 font-bold text-xl'>Loading...</h2>
		</section>;
	}

	return (
		<section className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-3xl bg-gray-600'>
			<h2 className='p-4 font-bold text-xl '>Channels</h2>
			<div className='flex h-full flex-col justify-between'>
				<div className='space-y-3 p-2'>
					{serverChannels?.map((channel) => (
						<div
							className='cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-purple-800 hover:text-white'
							key={channel.id}
						>
							#{channel.name}
						</div>
					))}
				</div>
				<footer className='relative flex items-center gap-4 bg-neutral-800 px-2 py-4 text-white'>
					<span className='text-sm'>
						Current Server: <em>{server.name}</em>
					</span>
					<button
						type='button'
						className='w-1/2 cursor-pointer rounded-md bg-gray-600 px-2 py-1 text-sm hover:bg-gray-700'
						onClick={onShowSettings}
					>
						Edit Server
					</button>
				</footer>
			</div>
		</section>
	);
};
