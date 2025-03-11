import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Key, Lock, ShieldCheck } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        mode: 'cors', // ✅ Fix CORS issues
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to OTP step
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3); // Move to new password step
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    console.log('Email:', email);       // ✅ Check if email is correctly set
    console.log('New Password:', newPassword);  // ✅ Check if password is correctly set
  
    if (!email || !newPassword) {
      setError('Please provide both email and password.');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      setError('Error updating password. Please try again.');
    } finally {
      setIsLoading(false);
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

        /* Reset Password Page Styles */
        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%);
          font-family: "Inter", sans-serif;
        }

        .reset-box {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
          transition: all 0.3s ease;
        }

        .reset-header {
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

        .reset-header h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1E3A8A;
        }

        .reset-form {
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

        .reset-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563EB;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-btn:hover {
          background-color: #1D4ED8;
          transform: scale(1.02);
        }

        .reset-btn:disabled {
          background-color: #93C5FD;
          cursor: not-allowed;
          transform: none;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #3B82F6;
          text-decoration: none;
          margin-top: 1.5rem;
          cursor: pointer;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: #1D4ED8;
        }

        .error-msg {
          color: #EF4444;
          text-align: center;
          margin-top: 1rem;
        }

        .step-description {
          text-align: center;
          color: #6B7280;
          margin-bottom: 1.5rem;
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

      <div className="reset-container">
        <div className="reset-box">
          <div className="reset-header">
            <ShieldCheck size={48} className="shield-icon" />
            <h2>Evidence Protection</h2>
          </div>

          {step === 1 && (
            <>
              <h3 className="step-description">Forgot your password?</h3>
              <p className="step-description">
                Enter your email address to receive an OTP.
              </p>

              <form className="reset-form" onSubmit={handleSubmitEmail}>
                <div className="input-group">
                  <Mail size={20} className="icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="reset-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                {error && <div className="error-msg">{error}</div>}
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="step-description">Enter OTP</h3>
              <p className="step-description">
                We've sent a 6-digit OTP to <strong>{email}</strong>.
              </p>

              <form className="reset-form" onSubmit={handleSubmitOtp}>
                <div className="input-group">
                  <Key size={20} className="icon" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="reset-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
                {error && <div className="error-msg">{error}</div>}
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="step-description">Set New Password</h3>
              <p className="step-description">
                Enter a new password for your account.
              </p>

              <form className="reset-form" onSubmit={handleSubmitNewPassword}>
                <div className="input-group">
                  <Lock size={20} className="icon" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="reset-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </button>
                {error && <div className="error-msg">{error}</div>}
              </form>
            </>
          )}

          <div 
            className="back-link"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;