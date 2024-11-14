import { createBrowserRouter } from 'react-router-dom';
import { LoginFormPage } from '../components/LoginFormPage/LoginFormPage.tsx';
import { SignupFormPage } from '../components/SignupFormPage/SignupFormPage.tsx';
import { Layout } from './Layout.tsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);