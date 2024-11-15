import { useEffect, useState } from 'react';
import { channels } from '../mockServers.ts';
import { BiCog } from 'react-icons/bi';

export const ChannelNav = ({ server }) => {
	const [serverChannels, setServerChannels] = useState([]);

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
		<section className='flex flex-col gap-4 rounded-tl-lg bg-gray-600 overflow-y-auto relative w-72 max-w-72'>
			<h2 className='text-xl font-bold p-4'>Loading...</h2>
		</section>;
	}

	return (
		<section className='flex flex-col gap-4 rounded-tl-3xl bg-gray-600 overflow-y-auto relative w-72 max-w-72'>
			<h2 className='text-xl font-bold p-4 '>Channels</h2>
			<div className='flex flex-col justify-between h-full'>
				<div className='space-y-3 p-2'>
					{serverChannels?.map((channel) => (
						<div
							className='hover:bg-purple-800 hover:text-white  transition-colors px-2 py-1 rounded-md cursor-pointer'
							key={channel.id}
						>
							#{channel.name}
						</div>
					))}
				</div>
				<footer className='relative bg-neutral-800 text-white py-4 px-2 flex gap-4 items-center'>
					<span>Current Server: {server.name}</span>
					<span>
						<BiCog size={24} />
					</span>
				</footer>
			</div>
		</section>
	);
};
