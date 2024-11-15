import { ChannelNav } from './components/ChannelNav.tsx';
import { channels, servers } from './mockServers.ts';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Server } from '../../types/index.ts';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { EditServerSidebar } from './components/EditServerSidebar.tsx';

export const ServerPage = () => {
	const { serverId } = useParams();
	const [server, setServer] = useState<Server | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const existingServer = servers.find((s) => s.id === Number(serverId));
		if (existingServer) {
			setServer(existingServer);
		}
		setIsLoading(false);
	}, [serverId]);

	const handleShowSettings = () => {
		setShowSettings(!showSettings);
	};

	const handleUpdateServer = (updatedServer: Server) => {
		setServer(updatedServer);
		// In a real app, you'd make an API call here
		setShowSettings(false);
	};

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	if (!server) {
		return <div>Server not found</div>; // Handle case when server doesn't exist
	}

	return (
		<div className='flex w-full'>
			{servers[0] && (
				<ChannelNav server={server} onShowSettings={handleShowSettings} />
			)}
			<section className='grid h-full w-full grid-cols-5'>
				<div
					className={`${
						showSettings ? 'col-span-4' : 'col-span-5'
					} flex w-full flex-col rounded-tr-3xl bg-gray-700 transition-all duration-300`}
				>
					{channels[0] && <ChatBox channel={channels[0]} />}
				</div>

				{showSettings && (
					<EditServerSidebar
						server={server}
						onUpdateServer={handleUpdateServer}
					/>
				)}
			</section>
		</div>
	);
};
