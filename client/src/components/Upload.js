import React, { useState, useRef, useEffect } from "react";
import { Upload, CheckCircle, X, Shield, ArrowRight, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth"; // Import the EthContext
import axios from 'axios'; // Import axios

// Helper function to generate a unique ID
const generateUniqueID = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Message Popup Component
const MessagePopup = ({ message, onClose, showDownload, onDownload }) => {
    const styles = {
        popup: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        popupContent: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            width: '450px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            textAlign: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#1E3A8A',
        },
        messageText: {
            fontSize: '1.25rem',
            color: '#1E3A8A',
            marginBottom: '1.5rem',
        },
        okButton: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
    };

    return (
        <div style={styles.popup}>
            <div style={styles.popupContent}>
                <button onClick={onClose} style={styles.closeButton}>
                    <X size={24} />
                </button>
                <div style={styles.messageText}>{message}</div>
                {showDownload ? (
                    <button onClick={onDownload} style={styles.okButton}>
                        <Download size={16} style={{ marginRight: '0.5rem' }} />
                        Download Certificate
                    </button>
                ) : (
                    <button onClick={onClose} style={styles.okButton}>
                        OK
                    </button>
                )}
            </div>
        </div>
    );
};

// Header Component
const Header = () => {
    const navigate = useNavigate();
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const logoutPendingRef = useRef(false);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                console.log("Logged out successfully");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("loginTime");
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            logoutPendingRef.current = false; // Reset after the request completes
        }
    };

    const handleLogoutClick = () => {
        if (!logoutPendingRef.current) {
            setShowLogoutConfirmation(true);
        }
    };

    const handleConfirmLogout = () => {
        if (!logoutPendingRef.current) {
            logoutPendingRef.current = true; // Prevent multiple calls during the asynchronous operation
            setShowLogoutConfirmation(false);
            handleLogout(); // Call handleLogout
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirmation(false);
        logoutPendingRef.current = false;  // Reset in case the dialog was showing.
    };
    const styles = {
        navbar: {
            position: 'fixed',
            top: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: '1rem 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 50,
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
        },
        logoutConfirmation: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        logoutConfirmationContent: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
        logoutConfirmationText: {
            fontSize: '1.25rem',
            color: '#1E3A8A',
            marginBottom: '1.5rem',
        },
        logoutConfirmationButtons: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
        },
        logoutConfirmationButton: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        confirmButton: {
            backgroundColor: '#2563EB',
            color: 'white',
        },
        cancelButton: {
            backgroundColor: '#E5E7EB',
            color: '#1E3A8A',
        },
    };

    return (
        <>
            <nav style={styles.navbar}>
                <div style={styles.logo}>
                    <Shield size={30} />
                    <span>Evidence Protection</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px' }}>Home</Link>
                    <Link to="/history" style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px' }}>History</Link>
                    <button onClick={handleLogoutClick} style={{ background: "none", border: "none", color: "#1E3A8A", cursor: "pointer" }}>
                        Logout
                    </button>
                    <a href="#features" style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px' }}>mm</a>
                </div>
            </nav>

            {showLogoutConfirmation && (
                <div style={styles.logoutConfirmation}>
                    <div style={styles.logoutConfirmationContent}>
                        <div style={styles.logoutConfirmationText}>Are you sure you want to log out?</div>
                        <div style={styles.logoutConfirmationButtons}>
                            <button onClick={handleConfirmLogout} style={{ ...styles.logoutConfirmationButton, ...styles.confirmButton }}>
                                Yes, Logout
                            </button>
                            <button onClick={handleCancelLogout} style={{ ...styles.logoutConfirmationButton, ...styles.cancelButton }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const VerifyFilePage = () => {
    // State management
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [showMessagePopup, setShowMessagePopup] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedFileType, setSelectedFileType] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [uniqueKey, setUniqueKey] = useState("");
    const [verifyFile, setVerifyFile] = useState(null);
    const [uniqueID, setUniqueID] = useState(null);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [email, setEmail] = useState(""); // State for user email

    const navigate = useNavigate();

    // Context from EthContext
    const { state: { contract, accounts } } = useEth();

    useEffect(() => {
        // Fetch user email when the component mounts
        fetch('http://localhost:5000/get-user-email', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEmail(data.email);
                } else {
                    console.error("Failed to fetch user email:", data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching user email:", error);
            });
    }, []); // Empty dependency array to run only on mount

    // Handler functions
    const handleFileTypeChange = (e) => {
        setSelectedFileType(e.target.value);
    };

    const handleUploadFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleVerifyFileChange = (e) => {
        setVerifyFile(e.target.files[0]);
    };

    const handleUniqueKeyChange = (e) => {
        setUniqueKey(e.target.value);
    };

    const handleClosePopup = () => {
        setShowUploadPopup(false);
        setShowVerifyPopup(false);
        setShowMessagePopup(false);
        setShowDownloadButton(false);
        setSelectedFileType("");
        setUploadFile(null);
        setUniqueKey("");
        setVerifyFile(null);
    };

    const uploadToBlockChain = async (id, hash) => {
        try {
            await contract.methods.uploadHash(id, hash).send({ from: accounts[0] });
            console.log("Data uploaded to Blockchain");
            setMessage("Data uploaded to Blockchain");
            setShowMessagePopup(true);
        } catch (error) {
            console.error("Error uploading to blockchain:", error);
            setMessage("Error uploading to blockchain.");
            setShowMessagePopup(true);
        }
    };

    const checkDataFromBlockChain = async (id, hash) => {
        try {
            const isValid = await contract.methods.checkHash(id, hash).call({ from: accounts[0] });
            return isValid === "1"; // Return a boolean

        } catch (error) {
            console.error("Error checking data from blockchain:", error);
            setMessage("Error checking data from blockchain.");
            setShowMessagePopup(true);
            return false;
        }
    };
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile || !selectedFileType) {
            setMessage("Please select a file and file type.");
            setShowMessagePopup(true);
            return;
        }

        // Generate a unique ID
        const newUniqueID = generateUniqueID();
        setUniqueID(newUniqueID);

        // Prepare file data for hashing
        const fileBuffer = await uploadFile.arrayBuffer();

        // Use the SubtleCrypto API to compute the hash
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
           // Current timestamp
           const uploadTimestamp = new Date().toISOString();
        // Store file details in localStorage
        const fileDetails = {
          filename: uploadFile.name,
          fileType: selectedFileType,
          uniqueID: newUniqueID,
          email: email,
           uploadTimestamp: uploadTimestamp,
             hash: hashHex, // Store the hash - Needed for Verification!
        };
        localStorage.setItem(newUniqueID, JSON.stringify(fileDetails));

        // Save the uploaded file name locally
        localStorage.setItem("uploadedFileName", uploadFile.name);

        try {
            // Upload to the database (assuming your backend endpoint is '/api/upload')
            const response = await axios.post('http://localhost:5000/api/upload', { // Replace with your backend URL
                uniqueID: newUniqueID,
                filename: uploadFile.name,
                fileType: selectedFileType,
                email: email, // Send user email
                uploadTimestamp:uploadTimestamp
            });

            if (response.status === 200) { // Adjust status code as needed
                console.log("File information saved to database");
                // Upload to blockchain
                await uploadToBlockChain(newUniqueID, hashHex);
                // Display success message
                setMessage(`File uploaded successfully! Unique ID: ${newUniqueID}`);
                setShowDownloadButton(true);
                setShowMessagePopup(true);

                // Close the upload popup
                setShowUploadPopup(false);

            } else {
                console.error("Failed to save file information to database.");
                setMessage("Failed to save file information. Please try again.");
                setShowMessagePopup(true);
            }

        } catch (error) {
            console.error("Error saving file information:", error);
            setMessage("Error saving file information. Please try again.");
            setShowMessagePopup(true);
        }

    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        if (!verifyFile || !uniqueKey) {
            setMessage("Please upload a file and enter the unique key.");
            setShowMessagePopup(true);
            return;
        }

        // Retrieve file details from localStorage
        const fileDetails = JSON.parse(localStorage.getItem(uniqueKey));
        if (!fileDetails) {
            setMessage("Invalid unique key. No file found.");
            setShowMessagePopup(true);
            return;
        }
        const fileBuffer = await verifyFile.arrayBuffer();

        // Use the SubtleCrypto API to compute the hash
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

        try {
            // Check hash from the blockchain
            const isValid = await checkDataFromBlockChain(uniqueKey, hashHex);

            let verificationResult = "Failed"; // Default value

            if (hashHex === fileDetails.hash) {
                if (isValid) {
                    verificationResult = "Authentic";
                    setMessage("Data is valid");
                } else {
                    verificationResult = "Corrupted";
                    setMessage("Data has been corrupted");
                }
            } else {
                verificationResult = "Corrupted";
                setMessage("File has been corrupted");
            }

            // Send verification results to the database (assuming your backend endpoint is '/api/verify')
            const response = await axios.post('http://localhost:5000/api/verify', { // Replace with your backend URL
                uniqueID: uniqueKey,
                filename: fileDetails.filename,
                verificationResult: verificationResult, // Authentic, Corrupted, Failed
                 email: email // Send user email for verification
            });

            if (response.status === 200) {
                console.log("Verification results saved to database");
                setShowMessagePopup(true); // Show success message after saving to DB
            } else {
                console.error("Failed to save verification results to database.");
                setMessage("Failed to save verification results. Please try again.");
                setShowMessagePopup(true); // Show error message
            }

        } catch (error) {
            console.error("Error saving verification results:", error);
            setMessage("Error saving verification results. Please try again.");
            setShowMessagePopup(true); // Show error message
        } finally {
            // Close the verify popup
            setShowVerifyPopup(false);
        }

        // Validate file format
        /*  const fileExtension = verifyFile.name.split('.').pop().toUpperCase();
          if (fileExtension !== fileDetails.fileType) {
            //setMessage(`File format does not match the original file. Expected: ${fileDetails.fileType}, Found: ${fileExtension}`);
            setShowMessagePopup(true);
            return;
          }*/

        // Close the verify popup
        setShowVerifyPopup(false);
    };

    const handleDownloadCertificate = () => {
        navigate('/certificate', { state: { uniqueID: uniqueID } });
        setShowMessagePopup(false);
    };

    // Styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #EEF2FF 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        verificationBox: {
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.1)',
            padding: '3rem',
            width: '500px',
            textAlign: 'center',
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1E3A8A',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
        },
        buttonContainer: {
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
        },
        button: {
            padding: '1.25rem 2rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            width: '180px',
            position: 'relative',
            overflow: 'hidden',
        },
        uploadButton: {
            backgroundColor: '#2563EB',
            color: 'white',
        },
        verifyButton: {
            backgroundColor: '#10B981',
            color: 'white',
        },
        buttonIcon: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginBottom: '0.5rem',
        },
        buttonText: {
            fontSize: '1.125rem',
            fontWeight: '600',
        },
        popup: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        popupContent: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2.5rem',
            width: '450px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            position: 'relative',
        },
    };

    return (
        <>
            <Header />
            <div style={styles.container}>
                {/* Main Content */}
                <div style={styles.verificationBox}>
                    <div style={styles.title}>
                        <Shield size={36} color="#2563EB" />
                        <span>File Verification</span>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            onClick={() => setShowUploadPopup(true)}
                            style={{ ...styles.button, ...styles.uploadButton }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={styles.buttonIcon}>
                                <Upload size={24} />
                            </div>
                            <span style={styles.buttonText}>Upload File</span>
                            <ArrowRight size={16} style={{ marginTop: '0.5rem' }} />
                        </button>

                        <button
                            onClick={() => setShowVerifyPopup(true)}
                            style={{ ...styles.button, ...styles.verifyButton }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={styles.buttonIcon}>
                                <CheckCircle size={24} />
                            </div>
                            <span style={styles.buttonText}>Verify File</span>
                            <ArrowRight size={16} style={{ marginTop: '0.5rem' }} />
                        </button>
                    </div>
                </div>

                {/* Upload Popup */}
                {showUploadPopup && (
                    <div style={styles.popup}>
                        <div style={styles.popupContent}>
                            {/* Close Button */}
                            <button onClick={handleClosePopup} style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#1E3A8A',
                            }}>
                                <X size={24} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem' }}>Upload File</h2>
                            <form onSubmit={handleUploadSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1E3A8A' }}>Select File Type:</label>
                                    <select
                                        value={selectedFileType}
                                        onChange={handleFileTypeChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="">Select a file type</option>
                                        <option value="JPG">JPG,PNG</option>
                                        <option value="PDF">PDF</option>
                                        <option value="Video">Video</option>
                                        <option value="Audio">Audio</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1E3A8A' }}>Upload File:</label>
                                    <input
                                        type="file"
                                        onChange={handleUploadFileChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                }}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Verify Popup */}
                {showVerifyPopup && (
                    <div style={styles.popup}>
                        <div style={styles.popupContent}>
                            {/* Close Button */}
                            <button onClick={handleClosePopup} style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#1E3A8A',
                            }}>
                                <X size={24} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem' }}>Verify File</h2>
                            <form onSubmit={handleVerifySubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1E3A8A' }}>Enter Unique Key:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter unique key"
                                        value={uniqueKey}
                                        onChange={handleUniqueKeyChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1E3A8A' }}>Upload File:</label>
                                    <input
                                        type="file"
                                        onChange={handleVerifyFileChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                }}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Message Popup */}
                {showMessagePopup && (
                    <MessagePopup
                        message={message}
                        onClose={handleClosePopup}
                        showDownload={showDownloadButton}
                        onDownload={handleDownloadCertificate}
                    />
                )}
            </div>
        </>
    );
};

export default VerifyFilePage;