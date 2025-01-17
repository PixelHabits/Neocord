import type React from 'react';
import { useModal } from '../../context/useModal.ts';

interface OpenModalMenuItemProps {
	modalComponent: React.ReactNode;
	itemText: string;
	onItemClick?: () => void;
	onModalClose?: () => void;
}
function OpenModalMenuItem({
	modalComponent, // component to render inside the modal
	itemText, // text of the button that opens the modal
	onItemClick, // optional: callback function that will be called once the button that opens the modal is clicked
	onModalClose, // optional: callback function that will be called once the modal is closed
}: OpenModalMenuItemProps) {
	const { setModalContent, setOnModalClose } = useModal();

	const handleInteraction = () => {
		if (onModalClose) setOnModalClose(onModalClose);
		setModalContent(modalComponent);
		if (typeof onItemClick === 'function') onItemClick();
	};

	return (
		<li>
			<button
				type='button'
				onClick={handleInteraction}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handleInteraction();
					}
				}}
				className='w-full text-left'
			>
				{itemText}
			</button>
		</li>
	);
}

export { OpenModalMenuItem };
