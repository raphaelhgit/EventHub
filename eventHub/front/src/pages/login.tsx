import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import getRole from "../utils/auth";

interface FieldErrors {
  email?: string;
  password?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  function handleChange(field: string, value: string) {
    setFormData((f) => ({ ...f, [field]: value }));
    if (field === "email") {
      setFieldErrors((e) => ({
        ...e,
        email: value && !validateEmail(value) ? "Email invalide" : "",
      }));
    }
    if (field === "password") {
      setFieldErrors((e) => ({
        ...e,
        password: value.length === 0 ? "Le mot de passe est requis" : "",
      }));
    }
  }

  async function handleSubmit() {
    const errors: FieldErrors = {
      email: !validateEmail(formData.email) ? "Email invalide" : "",
      password: formData.password.length === 0 ? "Le mot de passe est requis" : "",
    };
    setFieldErrors(errors);
    if (Object.values(errors).some((e) => e)) return;

    setApiError("");
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
      navigate(role === "organizer" || role === "admin" ? "/organizer/dashboard" : "/");
    } else {
      setApiError("Email ou mot de passe incorrect");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-80 gap-4">
        <p>login</p>

        <div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-black border-2 w-full p-2"
            placeholder="Email"
          />
          {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="border-black border-2 w-full p-2"
            placeholder="Mot de passe"
          />
          {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
        </div>

        <button onClick={handleSubmit} className="border-black border-2 p-2">
          Se connecter
        </button>

        {apiError && <p className="text-red-500">{apiError}</p>}
      </div>
    </div>
  );
}
