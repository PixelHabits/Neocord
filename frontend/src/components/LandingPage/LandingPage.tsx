import "./LandingPage.css";
import { OpenModalButton } from "../OpenModalButton/OpenModalButton.tsx";
import { SignupFormModal } from "../SignupFormModal/SignupFormModal.tsx";
import { LoginFormModal } from "../LoginFormModal/LoginFormModal.tsx";
import { useStore } from "../../store/store.ts";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

	return (
		<div className='flex h-full flex-col items-center pt-16 text-white'>
			<h1 className='pb-4 font-bold text-4xl text-white'>Welcome to Neocord!</h1>
			<p className='mb-4 w-1/2 text-center text-lg '>
				Neocord is a place where you can belong to a school club, a gaming group,
				or a worldwide art community. Where just you and a handful of friends can
				spend time together. A place that makes it easy to talk every day and
				hang out more often.
			</p>
			    {user ? (
				<div>
					<button className='mt-2 cursor-pointer rounded-md border-1 border-gray-300 bg-blue-500 p-4 text-white text-xl transition-all duration-300 hover:bg-indigo-500' type="button" onClick={() => navigate('/servers')}>Go to your servers!</button>
				</div>
			) : (
				<div id='landing-page-get-started-button-container' className='[&_*:first-child]:transition-all [&_*:first-child]:duration-300 [&_*:first-child]:bg-blue-500 [&_*:first-child]:hover:bg-indigo-500 [&_*]:m-2 [&_*]:w-30 [&_*]:cursor-pointer [&_*]:rounded-md [&_*]:border-1 [&_*]:border-gray-300 [&_*]:bg-neutral-800 [&_*]:p-4 [&_*]:text-white [&_*]:hover:bg-neutral-900 [&_*:last-child]:transition-all [&_*:last-child]:duration-300'>
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
			<footer className='mt-52'>
				<div className='flex w-100 items-center justify-between text-sm'>
					<span className='text-gray-400 text-lg'>Dev Team:{" "}</span>
                    <a className='transition-all duration-300 hover:text-indigo-500' href="https://github.com/PixelHabits">Devin Alsup</a>
                    <a className='transition-all duration-300 hover:text-indigo-500' href="https://github.com/izzymadethat">Isaiah Vickers</a>
					<a className='transition-all duration-300 hover:text-indigo-500' href="https://github.com/Mayboyzz">Christian May</a>
				</div>
			</footer>
		</div>
	);
};


