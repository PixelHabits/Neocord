import { ChannelNav } from './components/ChannelNav.tsx';
import { servers } from './mockServers.ts';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const ServerPage = () => {
	const { serverId } = useParams();
	const [server, setServer] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const existingServer = servers.find((s) => s.id === Number(serverId));
		if (existingServer) {
			setServer(existingServer);
		}
		setIsLoading(false);
	}, [serverId]);

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	if (!server) {
		return <div>Server not found</div>; // Handle case when server doesn't exist
	}

	return (
		<div className='flex'>
			{servers[0] && <ChannelNav server={server} />}
			{/* TODO: Top bar to show Server name, and other options */}
			{/* {channels[0] && <ChatBox channel={channels[0]} />*/}
		</div>
	);
};
