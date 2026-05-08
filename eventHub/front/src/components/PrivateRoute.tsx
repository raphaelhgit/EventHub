import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function PrivateRoute() {
  const auth = useContext(AuthContext);

  if (auth?.loading) return <p>Chargement...</p>;
  if (!auth?.role) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function OrganizerRoute() {
  const auth = useContext(AuthContext);

  if (auth?.loading) return <p>Chargement...</p>;
  if (!auth?.role) return <Navigate to="/login" replace />;
  if (auth.role !== "organizer" && auth.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
