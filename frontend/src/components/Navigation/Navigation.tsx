import { NavLink } from "react-router-dom";
import { ProfileButton } from "./ProfileButton.tsx";
import "./Navigation.css";
import { useStore } from "../../store/store.ts";


function Navigation() {
  const user = useStore((state) => state.user);
  
  return (
    <ul className="flex items-center justify-between p-4 align-middle text-white">
      <li className="text-3xl">
        <NavLink to="/">Home</NavLink>
      </li>
       
      <li className="text-3xl pt-2 flex items-center">
        {user && (
          <NavLink className="text-blue-500 text-xl mr-4" to="/login">Join a server!</NavLink>
        )}
        <ProfileButton/>
      </li>
    </ul>
  );
}

export { Navigation };
