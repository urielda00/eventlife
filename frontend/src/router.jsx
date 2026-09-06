// src/router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext";
import Spinner from "./components/ui/Spinner";

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyEvents = lazy(() => import("./pages/MyEvents"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const EventDetails = lazy(() => import("./features/events/EventDetails.jsx"));

export default function Router() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} /> {/* ✅ */}

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected */}
        <Route
          path="/events/create"
          element={user ? <CreateEvent /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/my-events"
          element={user ? <MyEvents /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
        />

        {/* Redirects */}
        <Route path="/create" element={<Navigate to="/events/create" replace />} />
        <Route path="/create/CreateEvent" element={<Navigate to="/events/create" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
