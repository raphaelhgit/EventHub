import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = ["Concert", "Conférence", "Festival", "Sport", "Théâtre", "Autre"];
const PAGE_SIZE = 6;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: number;
  totalPlaces: number;
  availablePlaces: number;
  category: string;
  image?: string;
}

interface Filters {
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
}

const emptyFilters: Filters = { category: "", city: "", minPrice: "", maxPrice: "" };

export default function Accueil() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [pending, setPending] = useState<Filters>(emptyFilters);
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadEvents = useCallback(async (f: Filters) => {
    setLoading(true);
    setError("");
    setVisibleCount(PAGE_SIZE);
    const params = new URLSearchParams({ upcoming: "true" });
    if (f.category) params.set("category", f.category);
    if (f.city.trim()) params.set("city", f.city.trim());
    if (f.minPrice !== "") params.set("minPrice", f.minPrice);
    if (f.maxPrice !== "") params.set("maxPrice", f.maxPrice);

    const response = await fetch(`/events?${params.toString()}`);
    if (!response.ok) {
      setError("Impossible de charger les événements");
      setLoading(false);
      return;
    }
    const data = await response.json();
    setEvents(data.events);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents(filters);
  }, [filters, loadEvents]);

  // Debounce city
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, city: pending.city }));
    }, 300);
    return () => clearTimeout(timer);
  }, [pending.city]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(pendingSearch);
      setVisibleCount(PAGE_SIZE);
    }, 300);
    return () => clearTimeout(timer);
  }, [pendingSearch]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => c + PAGE_SIZE);
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function handleReset() {
    setPending(emptyFilters);
    setPendingSearch("");
    setFilters(emptyFilters);
    setSearch("");
  }

  const filtered = events.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q)
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Événements à venir</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={pendingSearch}
        onChange={(e) => setPendingSearch(e.target.value)}
        className="border-black border-2 p-2 w-full mb-4"
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={pending.category}
          onChange={(e) => {
            const val = e.target.value;
            setPending((f) => ({ ...f, category: val }));
            setFilters((f) => ({ ...f, category: val }));
          }}
          className="border-black border-2 p-2"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          type="text"
          placeholder="Ville"
          value={pending.city}
          onChange={(e) => setPending((f) => ({ ...f, city: e.target.value }))}
          className="border-black border-2 p-2"
        />

        <input
          type="number"
          placeholder="Prix min (€)"
          value={pending.minPrice}
          min={0}
          onChange={(e) => {
            const val = e.target.value;
            setPending((f) => ({ ...f, minPrice: val }));
            setFilters((f) => ({ ...f, minPrice: val }));
          }}
          className="border-black border-2 p-2 w-32"
        />

        <input
          type="number"
          placeholder="Prix max (€)"
          value={pending.maxPrice}
          min={0}
          onChange={(e) => {
            const val = e.target.value;
            setPending((f) => ({ ...f, maxPrice: val }));
            setFilters((f) => ({ ...f, maxPrice: val }));
          }}
          className="border-black border-2 p-2 w-32"
        />

        <button onClick={handleReset} className="border-black border-2 px-4 py-2">
          Réinitialiser
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filtered.length === 0 && <p>Aucun événement trouvé.</p>}

      <div className="flex flex-col gap-4">
        {visible.map((event) => (
          <div key={event.id} className="border-black border-2 p-4 flex gap-4">
            {event.image && <img src={event.image} alt={event.title} className="w-32 h-24 object-cover" />}
            <div className="flex flex-col gap-1 flex-1">
              <h2 className="text-lg font-bold">{event.title}</h2>
              <p className="text-sm">{event.category} · {event.city}</p>
              <p className="text-sm">{event.date} à {event.time} · {event.location}</p>
              <p className="font-bold">{event.price} €</p>
              <p className="text-sm">Places disponibles : {event.availablePlaces} / {event.totalPlaces}</p>
              <Link to={`/events/${event.id}`} className="border-black border-2 px-3 py-1 self-start mt-1">
                Voir et acheter
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel infinite scroll */}
      <div ref={sentinelRef} className="h-4 mt-4" />
      {hasMore && <p className="text-center text-sm">Chargement de la suite...</p>}
      {!hasMore && !loading && filtered.length > 0 && (
        <p className="text-center text-sm mt-2">{filtered.length} événement(s) au total</p>
      )}
    </div>
  );
}
