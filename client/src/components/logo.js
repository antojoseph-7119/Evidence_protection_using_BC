import React from "react";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
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
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact" className="contact-btn">Contact</a>
        </div>
      </nav>
    </>
  );
};

export default Header;