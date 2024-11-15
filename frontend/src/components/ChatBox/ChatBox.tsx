import { messages } from '../ServerPage/mockServers.ts';
import './ChatBox.css';

interface Channel {
	id: number;
	name: string;
	serverId: number;
	visibility: 'public' | 'private';
}

export const ChatBox = ({ channel }: { channel: Channel }) => {
	return (
		<section className='grid h-full w-full grid-cols-5'>
			<div className='col-span-4 flex h-full w-full flex-col-reverse gap-4 overflow-y-scroll bg-gray-700 p-4'>
				<div className='flex flex-col gap-4'>
					{messages
						.filter((m) => m.channelId === channel.id)
						.slice(0, 4)
						.map((msg) => (
							<div key={msg.id}>
								<h4>{msg.userId}</h4>
								<div className='flex rounded-md bg-neutral-800 px-4 py-8 text-neutral-400'>
									<span>{msg.body}</span>
								</div>
								<span className='text-xs italic'>{msg.createdAt}</span>
							</div>
						))}
				</div>
			</div>
		</section>
	);
};
