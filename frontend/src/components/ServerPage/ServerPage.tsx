import { channels, servers } from './mockServers.ts';

export const ServerPage = () => {
	return (
		<div className='flex'>
			<aside className='flex flex-col items-center px-4 gap-4 relative'>
				{/* TODO: Add server tooltips (to be implemented later) */}
				{servers.map((server) => (
					<div
						key={server.id}
						className='rounded-full bg-gray-500 h-16 w-16 flex justify-center p-1 items-center cursor-pointer'
					>
						{server.name[0].toUpperCase()}
					</div>
				))}
				<div className='w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-4xl text-gray-400 mb-4 cursor-pointer absolute bottom-0'>
					+
				</div>
			</aside>
			{/* Channel list */}
			<section className='flex flex-col gap-4 rounded-tl-lg bg-gray-600 overflow-y-auto relative w-72 max-w-72'>
				<h2 className='text-xl font-bold  p-4 '>Channels</h2>
				<div className='space-y-3 p-2'>
					{channels.map((channel) => (
						<div
							className='hover:bg-purple-800 hover:text-white  transition-colors px-2 py-1 rounded-md cursor-pointer'
							key={channel.id}
						>
							#{channel.name}
						</div>
					))}
				</div>
				<footer className='relative bottom-0 mt-4 bg-neutral-800 text-white py-4 px-2'>
					user input goes here
				</footer>
			</section>
			{/* Top bar to show Server name, and other options */}
			<section className='grid grid-cols-5 w-full'>
				{/* Section should be a 3fr 2fr layout? */}
				{/* 
					SECTION 1 (4fr): MESSAGES 
					Messages display area
					Input area to send message
				*/}
				{/* 
					SECTION 2 (1fr): MEMBERS
					Show all members in the server
				*/}
				<div className='col-span-4 bg-gray-700 w-full'>
					<h2>Messages from server goes here</h2>
				</div>
			</section>
		</div>
	);
};
