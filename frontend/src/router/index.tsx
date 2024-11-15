import { createBrowserRouter } from 'react-router-dom';
import { LoginFormPage } from '../components/LoginFormPage/LoginFormPage.tsx';
import { ServerPage } from '../components/ServerPage/ServerPage.tsx';
import { SignupFormPage } from '../components/SignupFormPage/SignupFormPage.tsx';
import { Layout } from './Layout.tsx';
import { ServerPage } from '../components/ServerPage/ServerPage.tsx';
import { ServerLayout } from '../components/ServerPage/components/ServerLayout.tsx';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <h1>Welcome!</h1>,
			},
			{
				path: 'login',
				element: <LoginFormPage />,
			},
			{
				path: 'signup',
				element: <SignupFormPage />,
			},
			{
				path: 'servers',
				element: <ServerLayout />,
				children: [
					{
						path: ':serverId',
						element: <ServerPage />,
					},
				],
			},
		],
	},
]);
