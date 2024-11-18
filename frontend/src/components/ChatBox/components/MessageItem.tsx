import { useStore } from '../../../store/store.ts';
import type { Message } from '../../../types/index.ts';
export const MessageItem = ({ message }: { message: Message }) => {
	const { removeReaction, addReaction } = useStore();

	const handleRemoveReactionClick = (messageId: number, reactionId: number) => {
		removeReaction(messageId, reactionId);
	};

	const handleAddReactionClick = (
		messageId: number,
		reaction: { emoji: string },
	) => {
		addReaction(messageId, reaction);
	};

	return (
		<div>
			<h4>{message.user?.username}</h4>
			<div className='flex flex-col bg-neutral-800/80 px-4 py-8 text-neutral-400 shadow-md'>
				<span>{message.body}</span>
				<div className='flex gap-2'>
					{message.reactions.map((reaction) => {
						return (
							<div
								key={reaction.id}
								onClick={() =>
									handleRemoveReactionClick(message.id, reaction.id)
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleRemoveReactionClick(message.id, reaction.id);
									}
								}}
								className='mt-2 flex w-fit items-center gap-2 rounded-md bg-neutral-700/80 px-2 py-1 text-xs hover:cursor-pointer hover:bg-neutral-700/90'
							>
								<span className='cursor-pointer'>{reaction.emoji}</span>
								<span>{1}</span>
							</div>
						);
					})}
					<button
						className='mt-2 w-fit rounded-md bg-neutral-700/80 px-2 py-1 text-xs hover:cursor-pointer hover:bg-neutral-700/90'
						type='button'
						onClick={() => handleAddReactionClick(message.id, { emoji: '👍' })}
					>
						+
					</button>
				</div>
				{/* <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button> */}
			</div>
			<span className='text-neutral-400 text-xs italic'>
				{new Date(message.createdAt).toLocaleString()}
			</span>
		</div>
	);
};
