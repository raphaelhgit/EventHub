import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const role = auth?.role;
  const navigate = useNavigate();
    const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <>
      <nav className="p-4 flex gap-5 text-amber-100 bg-blue-900 text-3xl">
          <img src="./favicon.svg" alt="icon" onClick={handleLogoClick} />
          <div className="flex gap-5 ml-auto">
          {role && <Link to="/tickets">tickets</Link>}
          {role && <Link to="/profile">profil</Link>}
          {role === "organizer" && <Link to="/dashboard">dashboard</Link>}
          {!role && <Link to="/login">login</Link>}
          {!role && <Link to="/register">register</Link>}
          
          </div>
      </nav>
    </>
  );
}
