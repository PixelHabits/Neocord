import { useEffect, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useStore } from '../../../store/store.ts';
import type { Channel, ServerDetails } from '../../../types/index.ts';
import { CreateChannelForm } from '../../CreateChannelForm/CreateChannelForm.tsx';
import { OpenModalButton } from '../../OpenModalButton/OpenModalButton.tsx';

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
			<div className='flex items-center justify-between px-6 py-4'>
				<h2 className='font-bold text-2xl '>Channels</h2>
				<OpenModalButton
					modalComponent={<CreateChannelForm />}
					buttonText={
						<BiPlusCircle
							size={24}
							className='cursor-pointer text-gray-300 transition-colors duration-200 hover:text-white'
						/>
					}
					className='text-gray-300 transition-colors duration-200 hover:text-white '
				/>
			</div>
			<div className='flex h-full flex-col justify-between'>
				<div className='space-y-1 p-2'>
					{server.channels?.length > 0 ? (
						server.channels.map((channel) => (
							<div
								className='flex items-center justify-between'
								key={channel.id}
							>
								<div
									className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2 py-4 font-bold text-gray-300 text-sm transition-colors duration-300 hover:bg-purple-800 hover:text-white ${selectedChannel?.id === channel.id ? 'bg-purple-800' : ''}`}
									onClick={() => handleChannelSelect(channel)}
								>
									<span>#{channel.name}</span>
								</div>
								{selectedChannel?.id === channel.id && (
									<button
										className='ml-2 cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-600'
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
