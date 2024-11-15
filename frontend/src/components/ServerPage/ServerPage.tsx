import { ChannelList } from '../ChannelList/ChannelList.tsx';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { ServerList } from './components/ServerList.tsx';
import { channels, servers } from './mockServers.ts';

export const ServerPage = () => {
	return (
		<div className='flex'>
			<ServerList servers={servers} />
			{/* Channel list */}
			<ChannelList server={servers[0]} />
			{/* TODO: Top bar to show Server name, and other options */}
			<ChatBox channel={channels[0]} />
		</div>
	);
};
