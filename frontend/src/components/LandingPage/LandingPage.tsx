import "./LandingPage.css";
import { OpenModalButton } from "../OpenModalButton/OpenModalButton";
import { SignupFormModal } from "../SignupFormModal/SignupFormModal";
import { LoginFormModal } from "../LoginFormModal/LoginFormModal";
import { useStore } from "../../store/store.ts";
import { NavLink } from "react-router-dom";

export const LandingPage = () => {
//   const user = useStore((state) => state.user);
    const user = {
        username: "test",
        email: "test@test.com"
    }

    return (
        <div className='flex h-screen flex-col items-center pt-16 text-white'>
            <h1 className='pb-4 font-bold text-4xl text-white'>Welcome to Neocord!</h1>
            <p className='mb-4 w-1/2 text-center text-lg '>Neocord is a place where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
            {user ? (
                <div className='mt-2 cursor-pointer rounded-md border-1 border-gray-300 bg-blue-500 p-4 text-white text-xl hover:bg-indigo-500'>
                    <NavLink to="/servers">Go to your servers!</NavLink>
                </div>
            ) : (
                <div id='landing-page-get-started-button-container' className='[&_*:first-child]:bg-blue-500 [&_*:first-child]:hover:bg-indigo-500 [&_*]:m-2 [&_*]:w-30 [&_*]:cursor-pointer [&_*]:rounded-md [&_*]:border-1 [&_*]:border-gray-300 [&_*]:bg-neutral-800 [&_*]:p-4 [&_*]:text-white [&_*]:hover:bg-neutral-900'>
                <OpenModalButton
                    buttonText='Sign Up'
                    modalComponent={<SignupFormModal />}
                />
                <OpenModalButton
                    buttonText='Log In'
                    modalComponent={<LoginFormModal />}
                />
                </div>
            )}
        </div>
  );
};


