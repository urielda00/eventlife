import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";

// Guards a route: if not authenticated, redirect to /auth with a return path
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for auth state to resolve -> show spinner
  if (loading) return <Spinner />;

  // Not logged in -> go to /auth with redirect info
  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Logged in -> render protected content
  return children;
}