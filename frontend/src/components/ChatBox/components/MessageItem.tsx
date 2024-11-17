import type { Message } from '../../../types/index.ts';

export const MessageItem = ({ message }: { message: Message }) => {
	return (
		<div>
			<h4>{message.user?.username}</h4>
			<div className='flex bg-neutral-800/80 px-4 py-8 text-neutral-400 shadow-md'>
				<span>{message.body}</span>
				{/* <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button> */}
			</div>
			<span className='text-neutral-400 text-xs italic'>
				{new Date(message.createdAt).toLocaleString()}
			</span>
		</div>
	);
};
