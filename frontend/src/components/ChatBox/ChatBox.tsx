import { messages } from '../ServerPage/mockServers';
import './ChatBox.css';

export const ChatBox = ({ channel }) => {
	return (
		<section className='grid grid-cols-5 w-full h-full'>
			<div className='col-span-4 bg-gray-700 w-full gap-4 flex flex-col-reverse overflow-y-scroll h-full p-4'>
				<div className='flex flex-col gap-4'>
					{messages
						.filter((m) => m.channel_id === channel.id)
						.slice(0, 4)
						.map((msg) => (
							<div key={msg.id}>
								<h4>{msg.user_id}</h4>
								<div className='flex px-4 py-8 rounded-md  bg-neutral-800 text-neutral-400'>
									<span>{msg.body}</span>
								</div>
								<span className='text-xs italic'>{msg.created_at}</span>
							</div>
						))}
				</div>
			</div>
		</section>
	);
};
