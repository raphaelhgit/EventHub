import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const role = auth?.role;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
    setOpen(false);
  };

  const links = (
    <>
      {role && <Link to="/tickets" onClick={() => setOpen(false)}>tickets</Link>}
      {role && <Link to="/profile" onClick={() => setOpen(false)}>profil</Link>}
      {(role === "organizer" || role === "admin") && (
        <Link to="/organizer/dashboard" onClick={() => setOpen(false)}>dashboard</Link>
      )}
      {!role && <Link to="/login" onClick={() => setOpen(false)}>login</Link>}
      {!role && <Link to="/register" onClick={() => setOpen(false)}>register</Link>}
    </>
  );

  return (
    <nav className="p-4 text-amber-100 bg-blue-900 text-3xl">
      <div className="flex items-center gap-5">
        <img src="./favicon.svg" alt="icon" onClick={handleLogoClick} className="cursor-pointer" />

        {/* Liens desktop */}
        <div className="hidden sm:flex gap-5 ml-auto">
          {links}
        </div>

        {/* Bouton burger mobile */}
        <button
          className="sm:hidden ml-auto text-amber-100"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu déroulant mobile */}
      {open && (
        <div className="sm:hidden flex flex-col gap-4 pt-4 border-t border-blue-700 mt-4">
          {links}
        </div>
      )}
    </nav>
  );
}
