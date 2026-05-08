import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  async function handleSubmit() {
    if (formData.password !== formData.confirmPassword) {
      setError("mot de passe différent");
      return;
    }
    const { confirmPassword, ...body } = formData;
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      auth?.setRole(formData.role);
      navigate(formData.role === "organizer" ? "/organizer/dashboard" : "/");
    } else {
      setError(data.message ?? "Erreur lors de la création du compte");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-80 gap-4">
        <p>register</p>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-black border-2"
          placeholder="Nom d'utilisateur"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-black border-2"
          placeholder="Email"
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border-black border-2"
          placeholder="Mot de passe"
        />
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="border-black border-2"
          placeholder="Confirmer le mot de passe"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border-black border-2"
        >
          <option value="user">Utilisateur</option>
          <option value="organizer">Organisateur</option>
        </select>
        <button onClick={handleSubmit} className="border-black border-2">
          Créer un compte
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
