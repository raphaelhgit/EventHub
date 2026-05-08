import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Stats {
  totalEvents: number;
  totalTicketsSold: number;
  validTickets: number;
  usedTickets: number;
  cancelledTickets: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem("token");
      const response = await fetch("/events/organizer/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setError("Impossible de charger les statistiques");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-80 gap-4">

      <h1>Dashboard organisateur</h1>
      <nav>
        <Link to="/organizer/events">Mes événements</Link>
        {" | "}
        <Link to="/organizer/events/new">Créer un événement</Link>
      </nav>
      <hr />
      <p>Événements créés : {stats.totalEvents}</p>
      <p>Billets vendus : {stats.totalTicketsSold}</p>
      <p>Billets valides : {stats.validTickets}</p>
      <p>Billets utilisés : {stats.usedTickets}</p>
      <p>Billets annulés : {stats.cancelledTickets}</p>
      <p>Chiffre d'affaires : {stats.totalRevenue} €</p>
      </div>
    </div>
  );
}
