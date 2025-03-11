import React, { useState } from "react";
import { Lock, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("loginTime", Date.now().toString());
        navigate("/upload");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Navbar Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 1rem 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
          color: #1E3A8A;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navbar-links a {
          text-decoration: none;
          color: #1E3A8A;
          transition: color 0.3s ease;
          padding: 8px 12px;
        }

        .navbar-links a:hover {
          color: #2563EB;
        }

        .contact-btn {
          background-color: #2563EB;
          color: white;
          padding: 6px 14px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease;
          white-space: nowrap;
        }

        .contact-btn:hover {
          background-color: #1D4ED8;
        }

        /* Login Page Styles */
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%);
          font-family: "Inter", sans-serif;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
          transition: all 0.3s ease;
        }

        .login-header {
          text-align: center;
          color: #1E3A8A;
          margin-bottom: 1.5rem;
        }

        .shield-icon {
          color: #2563EB;
          margin-bottom: 1rem;
          font-size: 48px;
          animation: pulse 2s infinite;
        }

        .login-header h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1E3A8A;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #2563EB;
          opacity: 0.7;
          font-size: 20px;
        }

        .input-group input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #3B82F6;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563EB;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background-color: #1D4ED8;
          transform: scale(1.02);
        }

        .auth-links {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .create-account-link {
          color: #3B82F6;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .create-account-link:hover {
          color: #1D4ED8;
        }

        .forgot-password-link {
          color: #3B82F6;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .forgot-password-link:hover {
          color: #1D4ED8;
        }

        .error-msg {
          color: #EF4444;
          text-align: center;
          margin-top: 1rem;
        }

        /* Animation for the icon */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Responsive Fix */
        @media (max-width: 768px) {
          .navbar-links {
            gap: 10px;
          }
          .navbar-links a {
            font-size: 14px;
          }
          .contact-btn {
            padding: 6px 10px;
            font-size: 14px;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-brand">
          <ShieldCheck size={30} />
          <span>Evidence Protection</span>
        </div>
        <div className="navbar-links">
          <button
            onClick={() => navigate("/")}
            style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Home
          </button>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <ShieldCheck size={48} className="shield-icon" />
            <h2>Evidence Protection</h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <User size={20} className="icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={20} className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <div className="error-msg">{error}</div>}
          </form>

          <div className="auth-links">
            <button
              onClick={() => navigate("/create-account")}
              className="create-account-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Create New Account
            </button>
            <button
              onClick={() => navigate("/passwordreset")}
              className="forgot-password-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;