import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import getRole from "../utils/auth";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  async function handleSubmit() {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      const role = await getRole();
      auth?.setRole(role);
      console.log("connecté");
      navigate(role === "organizer" ? "/dashboard" : "/");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-80 gap-4">
        <p>login</p>
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
        <button onClick={handleSubmit} className="border-black border-2">
          Se connecter
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
