import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';

export const DeleteChannelConfirmation = ({
	onDeleteChannel,
}: { onDeleteChannel: (channelId: number) => void }) => {
	const { closeModal } = useModal();
	const { currentChannel } = useStore();

	return (
		<div className='flex flex-col gap-4 rounded-md bg-background p-4'>
			<h1 className='font-bold text-2xl text-gray-200'>
				Confirm Delete Channel?
			</h1>
			<p className='text-gray-400'>
				Are you sure you want to delete this channel? This action cannot be
				undone.
			</p>
			<div className='flex justify-end gap-2'>
				<button
					type='button'
					className='cursor-pointer rounded-md bg-gray-700 p-2 text-gray-200'
					onClick={closeModal}
				>
					Cancel
				</button>
				<button
					type='button'
					className='cursor-pointer rounded-md bg-red-500 p-2 text-white'
					onClick={() => {
						onDeleteChannel(currentChannel?.id || 0);
						closeModal();
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
};
