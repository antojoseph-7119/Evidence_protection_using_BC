import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Lock, 
  Users, 
  BarChart, 
  Search, 
  Menu, 
  X,
  User,
  LogIn,
  UserPlus,
  UserCheck // Added UserCheck icon for account creation
} from 'lucide-react';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const toggle = () => {
    navigate(localStorage.getItem("user") ? "/upload" : "/login");
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Inline styles to replace external CSS
  const styles = {
    root: {
      maxWidth: '100%',
      overflowX: 'hidden',
      fontFamily: 'Inter, sans-serif',
    },
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '1rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 'bold',
      color: '#1E3A8A',
    },
    navMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    navLink: {
      textDecoration: 'none',
      color: '#1E3A8A',
      transition: 'color 0.3s ease',
      padding: '8px 12px',
    },
    contactButton: {
      backgroundColor: '#2563EB',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'background-color 0.3s ease',
      whiteSpace: 'nowrap',
    },
    mobileMenuButton: {
      display: 'none', // Hidden by default
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    mobileMenu: {
      display: 'none', // Hidden by default
      flexDirection: 'column',
      gap: '10px',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    heroSection: {
      background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
      color: 'white',
      padding: '150px 5% 100px',
      textAlign: 'center',
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '3rem',
      marginBottom: '20px',
    },
    heroActions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '30px',
    },
    primaryButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: 'white',
      color: '#2563EB',
      cursor: 'pointer',
    },
    featuresSection: {
      padding: '100px 5%',
      backgroundColor: 'white',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '30px',
    },
    featureCard: {
      textAlign: 'center',
      padding: '30px',
      backgroundColor: '#EFF6FF',
      borderRadius: '10px',
    },
    solutionsSection: {
      padding: '100px 5%',
      backgroundColor: '#EFF6FF',
    },
    solutionsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '30px',
    },
    solutionCard: {
      flex: 1,
      backgroundColor: 'white',
      padding: '30px',
      textAlign: 'center',
      borderRadius: '10px',
    },
    footer: {
      backgroundColor: '#1E3A8A',
      color: 'white',
      padding: '50px 5%',
      textAlign: 'center',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    modalTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '1.5rem',
    },
    modalButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: '#EFF6FF',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    modalButtonHover: {
      backgroundColor: '#DBEAFE',
    },
  };

  // Responsive styles for mobile menu
  if (window.innerWidth <= 768) {
    styles.navMenu = {
      ...styles.navMenu,
      display: isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    };
    styles.mobileMenuButton = {
      ...styles.mobileMenuButton,
      display: 'block',
    };
  }

  const features = [
    {
      icon: <FileText size={40} color="#2563EB" />,
      title: "Secure Document Management",
      description: "Immutable blockchain storage with encryption ensures tamper-proof security."
    },
    {
      icon: <Lock size={40} color="#2563EB" />,
      title: "Access Control",
      description: "Role-based permissions and smart contracts prevent unauthorized access."
    },
    {
      icon: <Users size={40} color="#2563EB" />,
      title: "Collaborative Workspace",
      description: "Secure real-time document sharing with blockchain-backed version control."
    },
    {
      icon: <BarChart size={40} color="#2563EB" />,
      title: "Audit Tracking",
      description: " Immutable logs track every action for full traceability and compliance."
    }
  ];

  return (
    <div style={styles.root}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Shield size={30} />
          <span>Evidence Protection</span>
        </div>

        {/* Mobile Menu Button */}
        <button style={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div style={styles.navMenu}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#solutions" style={styles.navLink}>Solutions</a>
        
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Secure. Efficient. Compliant.</h1>
          <p>Protect your most sensitive legal evidence with cutting-edge security technology.</p>
          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={toggle}>Get Started</button>
            <button style={{...styles.primaryButton, backgroundColor: 'transparent', color: 'white', border: '2px solid white'}}>
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Powerful Features</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={{marginBottom: '20px'}}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" style={styles.solutionsSection}>
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Tailored Solutions</h2>
        <div style={styles.solutionsContainer}>
          <div style={styles.solutionCard}>
            <h3>Legal Firms</h3>
            <p>End-to-end evidence management for law practices.</p>
          </div>
          <div style={styles.solutionCard}>
            <h3>Law Enforcement</h3>
            <p>Secure case file tracking and evidence preservation.</p>
          </div>
          <div style={styles.solutionCard}>
            <h3>Corporate Legal</h3>
            <p>Comprehensive document security for corporate legal departments.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div>
          <div style={styles.logo}>
            <Shield size={30} />
            <span>Evidence Protection</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0'}}>
            <a href="#privacy" style={{color: 'white', textDecoration: 'none'}}>Privacy Policy</a>
            <a href="#terms" style={{color: 'white', textDecoration: 'none'}}>Terms of Service</a>
            <a href="#support" style={{color: 'white', textDecoration: 'none'}}>Support</a>
          </div>
          <div>
            © 2025 Evidence Protection. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Modal for Login and Account Creation */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={toggleModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Welcome to Evidence Protection</h2>
            <div style={styles.modalActions}>
              <button style={styles.modalButton} onClick={() => navigate("/login")}>
                <LogIn size={40} color="#2563EB" />
                <span>Login</span>
              </button>
              <button style={styles.modalButton} onClick={() => {
                toggleModal(); // Close the modal
                navigate("/create-account"); // Navigate to account creation page
              }}>
                <UserCheck size={40} color="#2563EB" /> {/* Updated icon */}
                <span>Create Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;