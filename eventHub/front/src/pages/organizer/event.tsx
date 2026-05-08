import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  category: string;
  price: number;
  totalPlaces: number;
  availablePlaces: number;
  image?: string;
}

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadEvents() {
    const token = localStorage.getItem("token");
    const response = await fetch("/events/organizer/my-events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError("Impossible de charger les événements");
      setLoading(false);
      return;
    }
    const data = await response.json();
    setEvents(data.events);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet événement ?")) return;
    const token = localStorage.getItem("token");
    const response = await fetch(`/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } else if (response.status === 409) {
      alert("Impossible de supprimer : des billets ont été vendus pour cet événement.");
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mes événements</h1>
      <button onClick={() => navigate("/organizer/events/new")}>
        Créer un événement
      </button>

      {events.length === 0 && <p>Aucun événement créé.</p>}

      {events.map((event) => {
        const ticketsSold = event.totalPlaces - event.availablePlaces;
        return (
          <div key={event.id}>
            {event.image && <img src={event.image} alt={event.title} width={200} />}
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>{event.date} à {event.time} · {event.location} · {event.city} · {event.category}</p>
            <p>Prix : {event.price} €</p>
            <p>Billets vendus : {ticketsSold} / {event.totalPlaces}</p>
            <Link to={`/organizer/events/${event.id}/edit`}>Modifier</Link>
            {" "}
            <button onClick={() => handleDelete(event.id)}>Supprimer</button>
          </div>
        );
      })}
    </div>
  );
}
