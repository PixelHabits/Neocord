import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import reactDom from 'react-dom';
import './Modal.css';

export interface ModalContextType {
	modalRef: React.RefObject<HTMLDivElement>;
	modalContent: React.ReactNode | null;
	setModalContent: (content: React.ReactNode) => void;
	setOnModalClose: (callback: (() => void) | null) => void;
	closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
	children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(
		null,
	);
	// callback function that will be called when modal is closing
	const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);

	const closeModal = () => {
		setModalContent(null); // clear the modal contents
		// If callback function is truthy, call the callback function and reset it
		// to null:
		if (typeof onModalClose === 'function') {
			setOnModalClose(null);
			onModalClose();
		}
	};

	const contextValue = {
		modalRef, // reference to modal div
		modalContent, // React component to render inside modal
		setModalContent, // function to set the React component to render inside modal
		setOnModalClose, // function to set the callback function called when modal is closing
		closeModal, // function to close the modal
	};

	return (
		<>
			<ModalContext.Provider value={contextValue}>
				{children}
			</ModalContext.Provider>
			<div ref={modalRef} />
		</>
	);
}

export function Modal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('Modal must be used within a ModalProvider');
	}

	const { modalRef, modalContent, closeModal } = context;

	// Focus the modal whenever modalContent changes (modal opens)
	useEffect(() => {
		if (modalContent) {
			const modalElement = document.getElementById('modal');
			if (modalElement) {
				modalElement.focus();
			}
		}
	}, [modalContent]);

	if (!(modalRef.current && modalContent)) return null;

	return reactDom.createPortal(
		<div
			id='modal'
			onKeyDown={(e) => e.key === 'Escape' && closeModal()}
			tabIndex={-1}
		>
			<div
				id='modal-background'
				onClick={closeModal}
				onKeyDown={closeModal}
				role='presentation'
			/>
			<div id='modal-content'>{modalContent}</div>
		</div>,
		modalRef.current,
	);
}

// Export ModalContext for the hook
export { ModalContext };
