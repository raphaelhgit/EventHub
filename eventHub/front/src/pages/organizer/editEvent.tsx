import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CATEGORIES = ["Concert", "Conférence", "Festival", "Sport", "Théâtre", "Autre"];

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: string;
  totalPlaces: string;
  category: string;
  image: string;
}

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<EventForm | null>(null);
  const [errors, setErrors] = useState<Partial<EventForm>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ticketsSold, setTicketsSold] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvent() {
      const token = localStorage.getItem("token");
      const response = await fetch(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setApiError("Événement introuvable");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setTicketsSold((data.totalPlaces ?? 0) - (data.availablePlaces ?? 0));
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        time: data.time ?? "",
        location: data.location ?? "",
        city: data.city ?? "",
        price: String(data.price ?? ""),
        totalPlaces: String(data.totalPlaces ?? ""),
        category: data.category ?? "",
        image: data.image ?? "",
      });
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  function set(field: keyof EventForm) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setForm((f) => (f ? { ...f, [field]: e.target.value } : f));
  }

  function validate(): boolean {
    if (!form) return false;
    const e: Partial<EventForm> = {};
    if (!form.title.trim()) e.title = "Titre requis";
    if (!form.description.trim()) e.description = "Description requise";
    if (!form.date) e.date = "Date requise";
    if (!form.time) e.time = "Heure requise";
    if (!form.location.trim()) e.location = "Lieu requis";
    if (!form.city.trim()) e.city = "Ville requise";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Prix invalide (≥ 0)";
    if (!form.totalPlaces || isNaN(Number(form.totalPlaces)) || Number(form.totalPlaces) <= 0)
      e.totalPlaces = "Nombre de places invalide (> 0)";
    if (Number(form.totalPlaces) < ticketsSold)
      e.totalPlaces = `Impossible : ${ticketsSold} billet(s) déjà vendu(s)`;
    if (!form.category) e.category = "Catégorie requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!form || !validate()) return;
    setApiError("");
    const token = localStorage.getItem("token");
    const response = await fetch(`/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        location: form.location,
        city: form.city,
        price: Number(form.price),
        totalPlaces: Number(form.totalPlaces),
        category: form.category,
        image: form.image || undefined,
      }),
    });
    if (response.ok) {
      navigate("/organizer/events");
    } else {
      const data = await response.json();
      setApiError(data.message ?? "Erreur lors de la modification");
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (!form) return <p>{apiError}</p>;

  return (
    <div>
      <h1>Modifier l'événement</h1>

      {ticketsSold > 0 && (
        <p>⚠️ {ticketsSold} billet(s) déjà vendu(s) — le nombre de places ne peut pas descendre en dessous de ce chiffre.</p>
      )}

      <div>
        <div>
          <input
            type="text"
            placeholder="Titre *"
            value={form.title}
            onChange={set("title")}
          />
          {errors.title && <p>{errors.title}</p>}
        </div>

        <div>
          <textarea
            placeholder="Description *"
            value={form.description}
            onChange={set("description")}
            rows={4}
          />
          {errors.description && <p>{errors.description}</p>}
        </div>

        <div>
          <div>
            <label>Date *</label>
            <input type="date" value={form.date} onChange={set("date")} />
            {errors.date && <p>{errors.date}</p>}
          </div>
          <div>
            <label>Heure *</label>
            <input type="time" value={form.time} onChange={set("time")} />
            {errors.time && <p>{errors.time}</p>}
          </div>
        </div>

        <div>
          <div>
            <input
              type="text"
              placeholder="Lieu *"
              value={form.location}
              onChange={set("location")}
            />
            {errors.location && <p>{errors.location}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Ville *"
              value={form.city}
              onChange={set("city")}
            />
            {errors.city && <p>{errors.city}</p>}
          </div>
        </div>

        <div>
          <div>
            <input
              type="number"
              placeholder="Prix (€) *"
              value={form.price}
              onChange={set("price")}
              min={0}
              step={0.01}
            />
            {errors.price && <p>{errors.price}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Nombre de places *"
              value={form.totalPlaces}
              onChange={set("totalPlaces")}
              min={ticketsSold || 1}
            />
            {errors.totalPlaces && <p>{errors.totalPlaces}</p>}
          </div>
        </div>

        <div>
          <select value={form.category} onChange={set("category")}>
            <option value="">-- Catégorie * --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p>{errors.category}</p>}
        </div>

        <div>
          <input
            type="url"
            placeholder="URL de l'image (optionnel)"
            value={form.image}
            onChange={set("image")}
          />
        </div>

        {apiError && <p>{apiError}</p>}

        <div>
          <button onClick={handleSubmit}>Enregistrer les modifications</button>
          <button onClick={() => navigate("/organizer/events")}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
