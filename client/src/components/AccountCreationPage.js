import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', zIndex: 1000, padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#1E3A8A' }}>
        <ShieldCheck size={30} />
        <span>Evidence Protection</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px' }}>Home</Link>
      </div>        
    </nav>
  );
};

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [showRequirements, setShowRequirements] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  const startOtpCountdown = () => {
    setOtpCountdown(300); // 5 minutes in seconds
    setIsOtpExpired(false);
  };

  useEffect(() => {
    let interval;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0 && step === 3) {
      setIsOtpExpired(true);
      setErrorMessage('OTP has expired. Please request a new one.');
    }
    return () => clearInterval(interval);
  }, [otpCountdown, step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password') {
      setShowRequirements(value.length > 0);
      setPasswordRequirements({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const handleNamePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (!Object.values(passwordRequirements).every(req => req)) {
      setErrorMessage("Password does not meet all requirements!");
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('OTP sent successfully');
        const maskedEmail = maskEmail(formData.email);
        setOtpSentMessage(`OTP sent to ${maskedEmail}`);
        setErrorMessage(''); // Clear any existing error messages
        startOtpCountdown();
        setStep(3);
      } else {
        console.log('Failed to send OTP:', data);
        setErrorMessage( data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while sending OTP.');
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (isOtpExpired) {
      setErrorMessage('OTP has expired. Please request a new one.');
      return;
    }
    const response = await fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        otp: formData.verificationCode,
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Account created successfully');
      setShowSuccessPopup(true);
    } else {
      setErrorMessage( data.message);
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    const maskedName = name[0] + '*'.repeat(name.length - 1);
    return `${maskedName}@${domain}`;
  };

  const requirements = [
    { id: 'minLength', text: 'At least 8 characters', met: passwordRequirements.minLength },
    { id: 'hasUppercase', text: 'At least one uppercase letter', met: passwordRequirements.hasUppercase },
    { id: 'hasLowercase', text: 'At least one lowercase letter', met: passwordRequirements.hasLowercase },
    { id: 'hasNumber', text: 'At least one number', met: passwordRequirements.hasNumber },
    { id: 'hasSpecialChar', text: 'At least one special character', met: passwordRequirements.hasSpecialChar }
  ];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div style={{ maxWidth: '100%', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <Header />

      {/* Step 1: Name and Password */}
      {step === 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1E3A8A' }}>Create Your Account</h2>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errorMessage}</p>}
            <form onSubmit={handleNamePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <User style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563EB', opacity: 0.7 }} size={20} />
                <input style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #3B82F6', borderRadius: '8px' }} type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Lock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563EB', opacity: 0.7 }} size={20} />
                <input style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #3B82F6', borderRadius: '8px' }} type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#2563EB', opacity: 0.7 }} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</div>
              </div>

              {showRequirements && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                  {requirements.map(req => (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: req.met ? '#10B981' : '#EF4444' }}>{req.met ? '✓' : '✗'}</span>
                      <span style={{ color: req.met ? '#10B981' : '#EF4444' }}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Lock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563EB', opacity: 0.7 }} size={20} />
                <input style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #3B82F6', borderRadius: '8px' }} type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#2563EB', opacity: 0.7 }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px' }}>Next</button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Email Entry */}
      {step === 2 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1E3A8A' }}>Enter Your Email</h2>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errorMessage}</p>}
            <form onSubmit={handleEmailVerification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Mail style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563EB', opacity: 0.7 }} size={20} />
                <input style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #3B82F6', borderRadius: '8px' }} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px' }}>Send OTP</button>
            </form>
          </div>
        </div>
      )}

      {/* Step 3: OTP Verification */}
      {step === 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1E3A8A' }}>Verify OTP</h2>
            {otpSentMessage && <p style={{ textAlign: 'center', color: '#2563EB', marginBottom: '1rem' }}>{otpSentMessage}</p>}
            {errorMessage && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errorMessage}</p>}
            <form onSubmit={handleOTPVerification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <CheckCircle style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563EB', opacity: 0.7 }} size={20} />
                <input style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #3B82F6', borderRadius: '8px' }} type="text" name="verificationCode" placeholder="Enter OTP" value={formData.verificationCode} onChange={handleChange} required />
              </div>
              {otpCountdown > 0 && (
                <p style={{ textAlign: 'center', color: '#6B7280' }}>
                  OTP expires in: <span style={{ fontWeight: 'bold' }}>{formatTime(otpCountdown)}</span>
                </p>
              )}
              <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px' }}>Verify OTP</button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)', textAlign: 'center' }}>
            <h2 style={{ color: '#1E3A8A' }}>Welcome to Evidence Protection</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Your account creation is successful!</p>
            <button
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => (window.location.href = '/login')}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationFlow;