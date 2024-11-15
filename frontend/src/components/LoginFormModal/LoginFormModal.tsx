
import type React from 'react';
import { useState } from 'react';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import './LoginForm.css';

interface LoginErrors {
	email?: string;
	password?: string;
	server?: string;
}

function LoginFormModal() {
    const login = useStore((state) => state.login);
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [errors, setErrors] = useState<LoginErrors>({});
		const { closeModal } = useModal();

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();

    const serverResponse = await login({
					email,
					password,
				});

			if (serverResponse) {
				setErrors(serverResponse);
			} else {
				closeModal();
			}
		};


		const handleDemoUser = async (e: React.MouseEvent) => {
			e.preventDefault();
			await login({ email: 'demo@aa.io', password: 'password' }).then(closeModal);
		};

		return (
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl">Log In</h1>
				<form onSubmit={handleSubmit}>
					<label>
						Email:
						<input
							className='w-full rounded-md border-1 border-gray-300 p-2'
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required={true}
						/>
					</label>
					{errors.email && <p>{errors.email}</p>}
					<label>
						Password:
						<input
							className='w-full rounded-md border-1 border-gray-300 p-2'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required={true}
						/>
					</label>
					{errors.password && <p>{errors.password}</p>}
					<button className='mt-4 w-full cursor-pointer rounded-md border-1 border-gray-300 bg-neutral-800 p-2 text-white hover:bg-neutral-900' type='button' onClick={handleDemoUser}>Demo User</button>
					<button className='mt-4 w-full cursor-pointer rounded-md border-1 border-gray-300 bg-neutral-800 p-2 text-white hover:bg-neutral-900' type='submit'>Log In</button>
				</form>
			</div>
		);
}

export { LoginFormModal };
