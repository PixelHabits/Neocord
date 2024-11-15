import { NavLink } from 'react-router-dom';
import { ProfileButton } from './ProfileButton.tsx';
import './Navigation.css';

function Navigation() {
	// const user = useStore((state) => state.user);
	const user = {
		username: 'test',
		email: 'test@test.com',
	};

	return (
		<ul className='flex items-center p-4 text-white'>
			<li>
				<NavLink className='text-3xl' to='/'>
					Neocord
				</NavLink>
			</li>
			{user && (
				<li className='ml-auto text-4xl'>
					<ProfileButton />
				</li>
			)}
		</ul>
	);
}

export { Navigation };
