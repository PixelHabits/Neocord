
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

		return (
			<>
				<h1>Log In</h1>
				<form onSubmit={handleSubmit}>
					<label>
						Email
						<input
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required={true}
						/>
					</label>
					{errors.email && <p>{errors.email}</p>}
					<label>
						Password
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required={true}
						/>
					</label>
					{errors.password && <p>{errors.password}</p>}
					<button type='submit'>Log In</button>
				</form>
			</>
		);
}

export { LoginFormModal };
