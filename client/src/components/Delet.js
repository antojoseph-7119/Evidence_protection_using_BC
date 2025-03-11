import React, { useState } from 'react';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Privacy concerns',
    'Created a second account',
    'Too many ads',
    'Found a better platform',
    'Taking a break from social media',
    'Concerns about data usage',
    'Too time consuming',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    if (!confirmation) {
      setError('Please confirm you want to delete your account');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle successful deletion or redirect
      alert('Account deletion process initiated');
    }, 1500);
  };

  // CSS styles as JavaScript objects
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '430px',
      backgroundColor: '#ffffff',
      border: '1px solid #dbdbdb',
      borderRadius: '3px',
      padding: '40px 30px'
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#262626',
      marginBottom: '8px',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '14px',
      color: '#8e8e8e',
      textAlign: 'center'
    },
    warningBox: {
      backgroundColor: '#ffefef',
      borderLeft: '4px solid #ed4956',
      padding: '16px',
      marginBottom: '24px'
    },
    warningText: {
      fontSize: '14px',
      color: '#ed4956',
      lineHeight: '1.5'
    },
    formGroup: {
      marginBottom: '16px'
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#262626',
      marginBottom: '8px'
    },
    formInput: {
      width: '100%',
      padding: '9px 8px',
      backgroundColor: '#fafafa',
      border: '1px solid #dbdbdb',
      borderRadius: '3px',
      color: '#262626',
      fontSize: '14px'
    },
    formSelect: {
      width: '100%',
      padding: '9px 8px',
      backgroundColor: '#fafafa',
      border: '1px solid #dbdbdb',
      borderRadius: '3px',
      color: '#262626',
      fontSize: '14px',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%238e8e8e\' d=\'M7 10l5 5 5-5H7z\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px'
    },
    checkboxInput: {
      width: '16px',
      height: '16px',
      marginRight: '8px'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#262626'
    },
    errorMessage: {
      color: '#ed4956',
      fontSize: '14px',
      marginBottom: '16px'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    deleteButton: {
      width: '100%',
      backgroundColor: '#ed4956',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 9px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    deleteButtonDisabled: {
      backgroundColor: '#f08a93',
      cursor: 'not-allowed'
    },
    cancelButton: {
      width: '100%',
      backgroundColor: '#efefef',
      color: '#262626',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 9px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Delete Your Account</h1>
          <p style={styles.subtitle}>We're sorry to see you go</p>
        </div>
        
        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <strong>Warning:</strong> When you delete your account, your profile, photos, videos, comments, likes and followers will be permanently removed.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel} htmlFor="password">
              Enter your password
            </label>
            <input 
              type="password" 
              id="password"
              style={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.formLabel} htmlFor="reason">
              Why are you deleting your account?
            </label>
            <select
              id="reason"
              style={styles.formSelect}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {reasons.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="confirmation"
              style={styles.checkboxInput}
              checked={confirmation}
              onChange={(e) => setConfirmation(e.target.checked)}
            />
            <label style={styles.checkboxLabel} htmlFor="confirmation">
              I understand this action cannot be undone
            </label>
          </div>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.deleteButton,
                ...(isSubmitting ? styles.deleteButtonDisabled : {})
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Permanently Delete My Account'}
            </button>
            
            <button
              type="button"
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;