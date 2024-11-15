import { useEffect, useState } from 'react';
import { messages } from '../ServerPage/mockServers.ts';
import './ChatBox.css';
import { BiSend } from 'react-icons/bi';
import type { Channel, Message } from '../../types/index.ts';
export const ChatBox = ({ channel }: { channel: Channel }) => {
	const [channelMessages, setChannelMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (channel) {
			setChannelMessages(messages.filter((m) => m.channelId === channel.id));
		}
	}, [channel]);

	return (
		<>
			<div className='h-[calc(100vh-200px)] overflow-y-auto p-4'>
				<div className='flex flex-col gap-4 '>
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
			<div className='relative flex items-center justify-center p-2'>
				<textarea
					className='w-full resize-none rounded-md bg-neutral-800 p-2 text-neutral-100 focus:outline-none'
					placeholder='Type your message...'
					rows={3}
				/>
				<button
					type='submit'
					className='mx-2 cursor-pointer rounded-full bg-purple-400 p-2 text-white hover:bg-purple-500'
				>
					<BiSend size={32} />
				</button>
			</div>
		</>
	);
};
