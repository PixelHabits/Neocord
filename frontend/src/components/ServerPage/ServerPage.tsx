import { ChannelList } from '../ChannelList/ChannelList.tsx';
import { ChatBox } from '../ChatBox/ChatBox.tsx';
import { ServerList } from './components/ServerList.tsx';
import { channels, servers } from './mockServers.ts';

export const ServerPage = () => {
	return (
		<div className='flex'>
			<ServerList servers={servers} />
			{servers[0] && <ChannelList server={servers[0]} />}
			{/* TODO: Top bar to show Server name, and other options */}
			{channels[0] && <ChatBox channel={channels[0]} />}
		</div>
	);
};
