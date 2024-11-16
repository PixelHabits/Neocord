import { NavLink } from 'react-router-dom';
import { ProfileButton } from './ProfileButton.tsx';
import './Navigation.css';
import { useStore } from '../../store/store.ts';

function Navigation() {
	const user = useStore((state) => state.user);

	return (
		<ul className='flex items-center justify-between p-4 text-white'>
			<li>
				<NavLink className='text-3xl' to='/'>
					Neocord
				</NavLink>
			</li>
			{user && (
				<li className='text-4xl'>
					<ProfileButton className='cursor-pointer' />
				</li>
			)}
		</ul>
	);
}

export { Navigation };
