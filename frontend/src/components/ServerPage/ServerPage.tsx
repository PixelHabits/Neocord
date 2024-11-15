import { ChannelNav } from './components/ChannelNav.tsx';
import { channels, servers } from './mockServers.ts';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Server } from '../../types/index.ts';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
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
			{/* TODO: Top bar to show Server name, and other options */}
			<section className='grid h-full w-full grid-cols-5'>
				<div
					className={`${
						showSettings ? 'col-span-4' : 'col-span-5'
					} flex w-full flex-col rounded-tr-3xl bg-gray-700 transition-all duration-300`}
				>
					{channels[0] && <ChatBox channel={channels[0]} />}
				</div>

				{showSettings && (
					<div className='col-span-1 m-4 flex h-full w-[calc(100%-2rem)] flex-col self-center justify-self-center rounded-r-lg bg-gray-700 p-4'>
						<div>
							<h3 className='font-bold text-gray-400 text-xl'>Edit Server</h3>
							<p className='text-gray-400 text-sm'>
								Edit this server&apos;s details
							</p>
							<form className='my-8 flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<label
										htmlFor='serverName'
										className='font-bold text-gray-400 text-sm'
									>
										Server Name
									</label>
									<input
										type='text'
										id='serverName'
										className='rounded-md bg-gray-800 p-2 text-gray-400 focus:outline-none'
										value={server.name}
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<label
										htmlFor='serverDescription'
										className='font-bold text-gray-400 text-sm'
									>
										Server Description
									</label>
									<textarea
										id='serverDescription'
										className='rounded-md bg-gray-800 p-2 text-gray-400 focus:outline-none'
										value={server.description}
									/>
								</div>
								<div className='flex justify-end'>
									<button
										type='submit'
										className='cursor-pointer rounded-md bg-gray-800 p-2 text-white hover:bg-gray-900'
									>
										Save
									</button>
								</div>
							</form>
						</div>

						{/* Members */}
						<div className='flex flex-col gap-2'>
							<h3 className='font-bold text-gray-400 text-xl'>Members</h3>
							<p className='text-gray-400 text-sm'>
								View members of this server
							</p>
						</div>
					</div>
				)}
			</section>
		</div>
	);
};
