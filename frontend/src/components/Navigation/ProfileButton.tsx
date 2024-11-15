import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useStore } from '../../store/store.ts';
import { LoginFormModal } from '../LoginFormModal/LoginFormModal.tsx';
import { SignupFormModal } from '../SignupFormModal/SignupFormModal.tsx';
import { OpenModalMenuItem } from './OpenModalMenuItem.tsx';

function ProfileButton() {
	const [showMenu, setShowMenu] = useState(false);
	const user = useStore((state) => state.user);
	const logout = useStore((state) => state.logout);
	const ulRef = useRef<HTMLUListElement>(null);

	const toggleMenu = (e: React.MouseEvent) => {
		e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e: MouseEvent) => {
			if (ulRef.current && !ulRef.current.contains(e.target as Node)) {
				setShowMenu(false);
			}
		};

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		logout();
		closeMenu();
	};

	return (
		<>
			<button type='button' onClick={toggleMenu}>
				<FaUserCircle />
			</button>
			{showMenu && (
				<ul className={'profile-dropdown'} ref={ulRef}>
					{user ? (
						<div className='flex cursor-pointer flex-col items-center justify-center rounded-md bg-neutral-200 p-4 text-gray-800 text-xl'>
							<li className='mb-2'>{user.username}</li>
							<li className='mb-2 border-gray-600 border-b-1 pb-4'>
								{user.email}
							</li>
							<li>
								<button
									className='w-full cursor-pointer rounded-md p-2'
									type='button'
									onClick={handleLogout}
								>
									Log Out
								</button>
							</li>
						</div>
					) : (
						<div
							id='profile-dropdown-not-logged-in'
							className='flex cursor-pointer flex-col items-center justify-center rounded-md bg-neutral-200 p-4 text-gray-800 text-xl'
						>
							<OpenModalMenuItem
								itemText='Log In'
								onItemClick={closeMenu}
								modalComponent={<LoginFormModal />}
							/>
							<OpenModalMenuItem
								itemText='Sign Up'
								onItemClick={closeMenu}
								modalComponent={<SignupFormModal />}
							/>
						</div>
					)}
				</ul>
			)}
		</>
	);
}

export { ProfileButton };
