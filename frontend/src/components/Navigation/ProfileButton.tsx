import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useStore } from '../../store/store.ts';
import { OpenModalMenuItem } from './OpenModalMenuItem.tsx';
import { LoginFormModal } from '../LoginFormModal/LoginFormModal.tsx';
import { SignupFormModal } from '../SignupFormModal/SignupFormModal.tsx';

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
						<>
							<li>{user.username}</li>
							<li>{user.email}</li>
							<li>
								<button type='button' onClick={handleLogout}>
									Log Out
								</button>
							</li>
						</>
					) : (
						<>
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
						</>
					)}
				</ul>
			)}
		</>
	);
}

export { ProfileButton };