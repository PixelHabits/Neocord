import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store/store.ts';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { ChannelNav } from './components/ChannelNav.tsx';
import { EditServerSidebar } from './components/EditServerSidebar.tsx';

export const ServerPage = () => {
	const { serverId } = useParams();
	const [showSettings, setShowSettings] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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
					alert((error as Error).message); //avoid console.log
					// console.error('Failed to fetch server', error);
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchServer();
	}, [serverId, getServer, getServers]);

	const handleShowSettings = () => {
		setShowSettings(!showSettings);
	};

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
		<div className='h-full w-full flex'>
			<ChannelNav
				server={currentServer}
				onShowSettings={handleShowSettings}
				onDeleteChannel={handleDeleteChannel}
			/>

			<main className='grid w-full grid-cols-5'>
				<div
					className={`${
						showSettings ? 'col-span-4' : 'col-span-5'
					} flex w-full flex-col bg-gray-700 transition-all duration-300 overflow-hidden h-full`}
				>
					{currentServer.channels?.length > 0 && currentChannel ? (
						<div className='flex flex-col w-full h-full'>
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
