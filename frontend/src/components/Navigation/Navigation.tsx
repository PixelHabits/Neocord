import { NavLink } from "react-router-dom";
import { ProfileButton } from "./ProfileButton.tsx";
import "./Navigation.css";
import { useStore } from "../../store/store.ts";


function Navigation() {
  const user = useStore((state) => state.user);
  
  return (
    <ul className="flex items-center p-4 text-white">
      <li>
        <NavLink className="text-3xl" to="/">Home</NavLink>
      </li>
       
      <li className="flex ml-auto">
        {user && (
          <NavLink className="text-blue-500 text-xl" to="/login">Join a server!</NavLink>
        )}
      </li>
      <li className="text-4xl">
        <ProfileButton />
      </li>
    </ul>
  );
}

export { Navigation };
