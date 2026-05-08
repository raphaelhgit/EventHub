import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  function validateField(field: string, value: string) {
    switch (field) {
      case "name":
        return value.trim().length < 2 ? "Le nom doit contenir au moins 2 caractères" : "";
      case "email":
        return !validateEmail(value) ? "Email invalide" : "";
      case "password":
        return value.length < 8 ? "Le mot de passe doit contenir au moins 8 caractères" : "";
      case "confirmPassword":
        return value !== formData.password ? "Les mots de passe ne correspondent pas" : "";
      default:
        return "";
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((f) => ({ ...f, [field]: value }));
    const err = validateField(field, value);
    setFieldErrors((e) => ({ ...e, [field]: err }));
    // Re-valide confirmPassword si on change le password
    if (field === "password") {
      const confirmErr = formData.confirmPassword && value !== formData.confirmPassword
        ? "Les mots de passe ne correspondent pas"
        : "";
      setFieldErrors((e) => ({ ...e, confirmPassword: confirmErr }));
    }
  }

  async function handleSubmit() {
    const errors: FieldErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some((e) => e)) return;

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
      setApiError(data.message ?? "Erreur lors de la création du compte");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-80 gap-4">
        <p>register</p>

        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-black border-2 w-full p-2"
            placeholder="Nom d'utilisateur"
          />
          {fieldErrors.name && <p className="text-red-500 text-sm">{fieldErrors.name}</p>}
        </div>

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

        <div>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="border-black border-2 w-full p-2"
            placeholder="Confirmer le mot de passe"
          />
          {fieldErrors.confirmPassword && <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>}
        </div>

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border-black border-2 p-2"
        >
          <option value="user">Utilisateur</option>
          <option value="organizer">Organisateur</option>
        </select>

        <button onClick={handleSubmit} className="border-black border-2 p-2">
          Créer un compte
        </button>

        {apiError && <p className="text-red-500">{apiError}</p>}
      </div>
    </div>
  );
}
