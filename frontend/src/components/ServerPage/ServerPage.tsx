import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store/store.ts';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { ChannelNav } from './components/ChannelNav.tsx';
import { EditServerSidebar } from './components/EditServerSidebar.tsx';

export const ServerPage = () => {
	const { serverId } = useParams();
	const [showSettings, setShowSettings] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const initialChannelSet = useRef(false);
	const {
		getServer,
		getServers,
		currentServer,
		currentChannel,
		deleteChannel,
		setCurrentChannel,
	} = useStore();

	useEffect(() => {
		const fetchServer = async () => {
			setIsLoading(true);
			if (serverId) {
				try {
					await Promise.all([getServer(Number(serverId)), getServers()]);
				} catch (error) {
					alert((error as Error).message);
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchServer();
		initialChannelSet.current = false;
	}, [serverId, getServer, getServers]);

	useEffect(() => {
		if (
			currentServer?.channels &&
			currentServer.channels.length > 0 &&
			!currentChannel &&
			!initialChannelSet.current
		) {
			const firstChannel = currentServer.channels[0];
			if (firstChannel) {
				setCurrentChannel(firstChannel);
				initialChannelSet.current = true;
			}
		}
	}, [currentServer?.channels, currentChannel, setCurrentChannel]);

	const handleShowSettings = () => {
		setShowSettings(!showSettings);
	};

	// fix this
	const handleDeleteChannel = async (channelId: number) => {
		try {
			await deleteChannel(channelId);
			if (currentServer) {
				await getServer(currentServer.id);
				setCurrentChannel(currentServer.channels?.[0] ?? null);
			}
		} catch (error) {
			alert((error as Error).message);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	if (!currentServer) {
		return <div>Server not found</div>; // Handle case when server doesn't exist
	}

	return (
		<div className='flex h-full w-full'>
			<ChannelNav
				server={currentServer}
				onShowSettings={handleShowSettings}
				onDeleteChannel={handleDeleteChannel}
			/>

			<main className='grid w-full grid-cols-5'>
				<div
					className={`${
						showSettings ? 'col-span-4' : 'col-span-5'
					} flex h-full w-full flex-col overflow-hidden bg-gray-700 transition-all duration-300`}
				>
					{currentServer.channels?.length > 0 && currentChannel ? (
						<div className='flex h-full w-full flex-col'>
							<ChatBox />
						</div>
					) : (
						<div className='flex h-full w-full flex-col items-center justify-center text-gray-400'>
							<h3 className='mb-2 font-bold text-xl'>
								Welcome to {currentServer.name}!
							</h3>
							<p>This server is brand new.</p>
							<p className='text-sm'>Create a channel to get started!</p>
						</div>
					)}
				</div>

				{showSettings && (
					<EditServerSidebar
						server={currentServer}
						onShowSettings={setShowSettings}
					/>
				)}
			</main>
		</div>
	);
};
