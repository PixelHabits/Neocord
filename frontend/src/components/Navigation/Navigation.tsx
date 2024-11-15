import { NavLink } from 'react-router-dom';
import { ProfileButton } from './ProfileButton.tsx';
import './Navigation.css';
import { useStore } from '../../store/store.ts';

function Navigation() {
	const user = useStore((state) => state.user);

	return (
		<ul className='flex items-center p-4 text-white'>
			<li>
				<NavLink className='text-3xl' to='/'>
					Neocord
				</NavLink>
			</li>
			{user && (
				<li className='ml-auto text-4xl [&_*:first-child]:cursor-pointer'>
					<ProfileButton />
				</li>
			)}
		</ul>
	);
}

export { Navigation };
