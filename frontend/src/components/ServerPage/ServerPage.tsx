import { ChannelNav } from './components/ChannelNav.tsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { EditServerSidebar } from './components/EditServerSidebar.tsx';
import { useStore } from '../../store/store.ts';

export const ServerPage = () => {
	const { serverId } = useParams();
	const [showSettings, setShowSettings] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { getServer, setCurrentServer, currentServer, currentChannel } =
		useStore();

	useEffect(() => {
		setIsLoading(true);
		if (serverId) {
			getServer(Number(serverId));
		}
		setIsLoading(false);
	}, [serverId]);

	const handleShowSettings = () => {
		setShowSettings(!showSettings);
	};

	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading component
	}

	if (!currentServer) {
		return <div>Server not found</div>; // Handle case when server doesn't exist
	}

	return (
		<div className='flex w-full'>
			<ChannelNav server={currentServer} onShowSettings={handleShowSettings} />

			<section className='grid h-full w-full grid-cols-5'>
				<div
					className={`${
						showSettings ? 'col-span-4' : 'col-span-5'
					} flex w-full flex-col rounded-tr-3xl bg-gray-700 transition-all duration-300`}
				>
					{currentChannel && <ChatBox channel={currentChannel} />}
				</div>

				{showSettings && (
					<EditServerSidebar
						server={currentServer}
						onUpdateServer={setCurrentServer}
					/>
				)}
			</section>
		</div>
	);
};
