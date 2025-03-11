import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("user"); // Check if user is logged in
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;  // Redirect to login if not authenticated
};

export default ProtectedRoute;

