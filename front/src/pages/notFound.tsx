import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/" className="border-black border-2 px-4 py-2">
        Retour à l'accueil
      </Link>
    </div>
  );
}
