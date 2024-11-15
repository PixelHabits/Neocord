import { NavLink } from "react-router-dom";
import { ProfileButton } from "./ProfileButton.tsx";
import "./Navigation.css";
import { useStore } from "../../store/store.ts";


function Navigation() {
  // const user = useStore((state) => state.user);
  const user = {
    username: "test",
    email: "test@test.com"
  }
  
  return (
    <ul className="flex items-center p-4 text-white">
      <li>
        <NavLink className="text-3xl" to="/">Neocord</NavLink>
      </li>
      {user && (
        <li className="text-4xl ml-auto">
          <ProfileButton />
        </li>
      )}
    </ul>
  );
}

export { Navigation };
