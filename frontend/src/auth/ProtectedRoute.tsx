import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useMe } from "../api/useMe";
import { TopBar } from "../components/TopBar";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { data: me } = useMe(isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <TopBar name={me?.fullname ?? ""} />
      <Outlet />
    </>
  );
};
