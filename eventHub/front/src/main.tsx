import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Accueil from "./pages/accueil";
import NotFound from "./pages/notFound";
import Layout from "./components/Layout.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PrivateRoute, OrganizerRoute } from "./components/PrivateRoute.tsx";

const Register = lazy(() => import("./pages/register"));
const Login = lazy(() => import("./pages/login"));
const Ticket = lazy(() => import("./pages/ticket"));
const Profile = lazy(() => import("./pages/profile"));
const CreateEvent = lazy(() => import("./pages/organizer/createEvent.tsx"));
const Dashboard = lazy(() => import("./pages/organizer/dashboard"));
const EditEvent = lazy(() => import("./pages/organizer/editEvent"));
const MyEvents = lazy(() => import("./pages/organizer/event"));
const EventDetail = lazy(() => import("./pages/eventDetail"));

const root = document.getElementById("root");
if (!root) throw new Error("Élément root introuvable");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
          <Routes>
            <Route element={<Layout />}>
              {/* Routes publiques */}
              <Route path="/" element={<Accueil />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* Routes utilisateur connecté */}
              <Route element={<PrivateRoute />}>
                <Route path="/tickets" element={<Ticket />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Routes organisateur */}
              <Route element={<OrganizerRoute />}>
                <Route path="/organizer/dashboard" element={<Dashboard />} />
                <Route path="/organizer/events" element={<MyEvents />} />
                <Route path="/organizer/events/new" element={<CreateEvent />} />
                <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
