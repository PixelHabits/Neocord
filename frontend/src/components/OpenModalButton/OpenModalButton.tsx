import { cn } from '@repo/ui';
import type React from 'react';
import { useModal } from '../../context/useModal.ts';
interface OpenModalButtonProps {
	modalComponent: React.ReactNode;
	buttonText: string | React.ReactNode;
	onButtonClick?: () => void;
	onModalClose?: () => void;
	className?: string;
}
function OpenModalButton({
	modalComponent, // component to render inside the modal
	buttonText, // text of the button that opens the modal
	onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
	onModalClose, // optional: callback function that will be called once the modal is closed
	className, // optional: className to be applied to the button
	...props
}: OpenModalButtonProps) {
	const { setModalContent, setOnModalClose } = useModal();

	const onClick = () => {
		if (onModalClose) setOnModalClose(onModalClose);
		setModalContent(modalComponent);
		if (typeof onButtonClick === 'function') onButtonClick();
	};

	return (
		<button
			type='button'
			onClick={onClick}
			className={cn('', className)}
			{...props}
		>
			{buttonText}
		</button>
	);
}

export { OpenModalButton };
