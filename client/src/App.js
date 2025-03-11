import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import AccountCreationPage from './components/AccountCreationPage';
import ProtectedRoute from './components/ProtectedRoute';
// Import ProtectedRoute
import LoginPage from "./components/LoginPage";

// Import the Content component
import WelcomePage from "./components/WelcomePage";
import Chatbot from "./components/Chatbot";
import Upload from "./components/Upload";
import History from "./components/History";
import Delet from "./components/Delet";
import Certificate from "./components/Certificate";
import Passwordreset from "./components/Passwordreset";

const App = () => {
  return (
    <EthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<AccountCreationPage />} />
          <Route path="/passwordreset" element={<Passwordreset />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Chatbot />} />
            
            <Route path="/button" element={<Upload />} />
            <Route path="/history" element={<History />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/delet" element={<Delet />} />
          </Route>
        </Routes>

        <SessionManager /> {/* Session Management Component */}
      </Router>
    </EthProvider>
  );
};

// Session Management Component
const SessionManager = () => {
  const navigate = useNavigate();
  const path = window.location.pathname; // Get current path

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const userEmail = localStorage.getItem("userEmail");

    // Redirect to login if no user is logged in and trying to access protected routes
    if (
      !userEmail &&
      path !== "/" &&
      path !== "/create-account" &&
      path !== "/login" &&
      path !== "/passwordreset"
    ) {
      console.log("No user logged in, redirecting...");
      navigate("/login");
      return;
    }

    // Check session expiration
    if (loginTime) {
      const timeElapsed = Date.now() - loginTime;
      const sessionDuration = 30 * 60 * 1000; // 30 minutes

      if (timeElapsed > sessionDuration) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("loginTime");
        console.log("Session expired. Logging out...");
        navigate("/login");
      } else {
        // Set a timeout to log out when the session expires
        setTimeout(() => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("loginTime");
          console.log("Session expired. Logging out...");
          navigate("/login");
        }, sessionDuration - timeElapsed);
      }
    }
  }, [navigate, path]);

  return null; // This component doesn't render anything
};

export default App;