import type { Channel, ServerDetails } from '../../../types/index.ts';
import { useStore } from '../../../store/store.ts';
import { useEffect, useState } from 'react';
import { OpenModalButton } from '../../OpenModalButton/OpenModalButton.tsx';
import { CreateChannelForm } from '../../CreateChannelForm/CreateChannelForm.tsx';
import { BiPlusCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';

export const ChannelNav = ({
	server,
	onShowSettings,
	onDeleteChannel,
}: {
	server: ServerDetails;
	onShowSettings: () => void;
	onDeleteChannel: (channelId: number) => void;
}) => {
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
			<div className='px-6 py-4 flex items-center justify-between'>
				<h2 className='font-bold text-2xl '>Channels</h2>
				<OpenModalButton
					modalComponent={<CreateChannelForm />}
					buttonText={
						<BiPlusCircle
							size={24}
							className='text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer'
						/>
					}
					className='text-gray-300 hover:text-white transition-colors duration-200 '
				/>
			</div>
			<div className='flex h-full flex-col justify-between'>
				<div className='space-y-1 p-2'>
					{server.channels?.length ? (
						server.channels.map((channel) => (
							<div className='flex items-center justify-between'>
								<div
									className={`cursor-pointer rounded-md px-2 py-4 transition-colors text-gray-300 hover:bg-purple-800 hover:text-white text-sm font-bold duration-300 flex items-center justify-between w-full gap-4 ${selectedChannel?.id === channel.id ? 'bg-purple-800' : ''}`}
									key={channel.id}
									onClick={() => handleChannelSelect(channel)}
								>
									<span>#{channel.name}</span>
								</div>
								{selectedChannel?.id === channel.id && (
									<button
										className='text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 ml-2'
										onClick={() => onDeleteChannel(channel.id)}
									>
										<FaTrash size={12} />
									</button>
								)}
							</div>
						))
					) : (
						<div className='p-4 text-center text-gray-400'>
							<p>No channels yet!</p>
							<p className='text-sm'>Create a channel to get started.</p>
						</div>
					)}
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
