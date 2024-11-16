import type { Channel, Server, ServerDetails } from '../../../types/index.ts';
import { useStore } from '../../../store/store.ts';

export const ChannelNav = ({
	server,
	onShowSettings,
}: { server: ServerDetails; onShowSettings: () => void }) => {
	const { setCurrentChannel, getChannelMessages } = useStore();

	const handleChannelSelect = async (channel: Channel) => {
		try {
			setCurrentChannel(channel);
			await getChannelMessages(channel.id);
		} catch (error) {
			console.log(error);
		}
	};

	if (!server) {
		<section className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-lg bg-gray-600'>
			<h2 className='p-4 font-bold text-xl'>Loading...</h2>
		</section>;
	}

	return (
		<nav className='relative flex w-72 max-w-72 flex-col gap-4 overflow-y-auto rounded-tl-3xl bg-gray-600'>
			<h2 className='p-4 font-bold text-xl '>Channels</h2>
			<div className='flex h-full flex-col justify-between'>
				<div className='space-y-3 p-2'>
					{server.channels?.map((channel) => (
						<div
							className='cursor-pointer rounded-md px-2 py-1 transition-colors text-gray-300 hover:bg-purple-800 hover:text-white text-sm font-bold'
							key={channel.id}
							onClick={() => handleChannelSelect(channel)}
						>
							#{channel.name}
						</div>
					))}
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
