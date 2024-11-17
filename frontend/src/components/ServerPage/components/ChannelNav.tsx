import { useEffect, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useStore } from '../../../store/store.ts';
import type { Channel, ServerDetails } from '../../../types/index.ts';
import { handleSubmitKeysDown } from '../../../utils/index.ts';
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
	const { setCurrentChannel } = useStore();
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

	const { user } = useStore();

	const handleChannelSelect = (channel: Channel) => {
		try {
			setCurrentChannel(channel);
			setSelectedChannel(channel);
		} catch (error) {
			alert((error as Error).message); //avoid console.log
			// console.log(error);
		}
	};

	useEffect(() => {
		const firstChannel = server.channels.find(
			(channel) => channel.visibility === 'public',
		);
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
		<nav className='relative flex w-72 max-w-72 flex-col gap-1 overflow-y-auto rounded-tl-xl bg-gray-600'>
			<div className='flex items-center justify-between px-6 py-3'>
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
						user?.id === server?.owner?.id ? (
							server.channels.map((channel) => (
								<div
									className='flex items-center justify-between'
									key={channel.id}
								>
									<div
										className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2 py-4 font-bold text-gray-300 text-sm transition-colors duration-300 hover:bg-purple-800 hover:text-white ${selectedChannel?.id === channel.id ? 'bg-purple-800' : ''}`}
										onClick={() => handleChannelSelect(channel)}
										onKeyDown={(e) =>
											handleSubmitKeysDown(e, () =>
												handleChannelSelect(channel),
											)
										}
									>
										<span>#{channel.name}</span>
									</div>
									{selectedChannel?.id === channel.id && (
										<button
											type='button'
											className='ml-2 cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-600'
											onClick={() => onDeleteChannel(channel.id)}
										>
											<FaTrash size={12} />
										</button>
									)}
								</div>
							))
						) : (
							server.channels
								.filter((channel) => channel.visibility === 'public')
								.map((channel) => (
									<div
										className='flex items-center justify-between'
										key={channel.id}
									>
										<div
											className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2 py-4 font-bold text-gray-300 text-sm transition-colors duration-300 hover:bg-purple-800 hover:text-white ${selectedChannel?.id === channel.id ? 'bg-purple-800' : ''}`}
											onClick={() => handleChannelSelect(channel)}
											onKeyDown={(e) =>
												handleSubmitKeysDown(e, () =>
													handleChannelSelect(channel),
												)
											}
										>
											<span>#{channel.name}</span>
										</div>
										{selectedChannel?.id === channel.id && (
											<button
												type='button'
												className='ml-2 cursor-pointer text-red-500 transition-colors duration-200 hover:text-red-600'
												onClick={() => onDeleteChannel(channel.id)}
											>
												<FaTrash size={12} />
											</button>
										)}
									</div>
								))
						)
					) : (
						<div className='p-4 text-center text-gray-400'>
							<p>No channels yet!</p>
							<p className='text-sm'>Create a channel to get started.</p>
						</div>
					)}
				</div>
				<footer className='flex h-20 items-center gap-4 bg-neutral-800 px-2 py-4 text-white'>
					<span className='w-1/2 text-sm'>
						Current Server: <em>{server.name}</em>
					</span>
					{user?.id === server?.owner?.id && (
						<button
							type='button'
							className='h-12 w-1/2 cursor-pointer rounded-md bg-gray-600 px-2 py-1 text-sm hover:bg-gray-700'
							onClick={onShowSettings}
						>
							Edit Server
						</button>
					)}
				</footer>
			</div>
		</nav>
	);
};
