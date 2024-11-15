import { useEffect, useState } from 'react';
import { messages } from '../ServerPage/mockServers';
import './ChatBox.css';
import { FaMessage } from 'react-icons/fa6';
import { BiSend } from 'react-icons/bi';

interface Channel {
	id: number;
	name: string;
	serverId: number;
	visibility: 'public' | 'private';
}

export const ChatBox = ({ channel }: { channel: Channel }) => {
	const [channelMessages, setChannelMessages] = useState([]);

	useEffect(() => {
		if (channel) {
			setChannelMessages(messages.filter((m) => m.channel_id === channel.id));
		}
	}, [channel]);

	return (
		<section className='grid grid-cols-5 w-full h-full'>
			<div className='col-span-4 bg-gray-700 w-full flex flex-col'>
				<div className='h-[calc(100vh-200px)] p-4 overflow-y-auto'>
					<div className='flex flex-col gap-4'>
						{channelMessages.map((msg) => (
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
				<div className='p-2 flex justify-center items-center relative'>
					<textarea
						className='w-full rounded-md p-2 bg-neutral-800 text-neutral-100 resize-none focus:outline-none'
						placeholder='Type your message...'
						rows={3}
					/>
					<button
						type='submit'
						className='bg-purple-400 rounded-full p-2 text-white mx-2 hover:bg-purple-500 cursor-pointer'
					>
						<BiSend size={32} />
					</button>
				</div>
			</div>
		</section>
	);
};
