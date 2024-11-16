import type { Channel, ServerDetails } from '../../../types/index.ts';
import { useStore } from '../../../store/store.ts';
import { useEffect, useState } from 'react';

export const ChannelNav = ({
	server,
	onShowSettings,
}: { server: ServerDetails; onShowSettings: () => void }) => {
	const { setCurrentChannel, getChannelMessages } = useStore();
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

	const handleChannelSelect = async (channel: Channel) => {
		try {
			setCurrentChannel(channel);
			setSelectedChannel(channel);
			await getChannelMessages(channel.id);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const firstChannel = server.channels?.[0];
		if (firstChannel) {
			setSelectedChannel(firstChannel);
		}
	}, [server.channels]);

	if (!server) {
		<section className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-lg bg-gray-600'>
			<h2 className='p-4 font-bold text-xl'>Loading...</h2>
		</section>;
	}

	return (
		<nav className='relative flex w-72 max-w-72 flex-col gap-1 overflow-y-auto rounded-tl-3xl bg-gray-600'>
			<div className='px-6 py-4'>
				<h2 className='font-bold text-2xl '>Channels</h2>
			</div>
			<div className='flex h-full flex-col justify-between'>
				<div className='space-y-1 p-2'>
					{server.channels?.map((channel) => (
						<div
							className={`cursor-pointer rounded-md px-2 py-4 transition-colors text-gray-300 hover:bg-purple-800 hover:text-white text-sm font-bold duration-300 ${selectedChannel?.id === channel.id ? 'bg-purple-800' : ''}`}
							key={channel.id}
							onClick={() => handleChannelSelect(channel)}
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
		</nav>
	);
};
