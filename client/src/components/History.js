import React, { useState, useEffect } from "react";
import { Clock, Upload, CheckCircle, ChevronDown, ChevronUp, FileText, File, Shield, CloudUpload, Calendar, Award, AlertTriangle } from "lucide-react";

const History = () => {
  const [isUploadExpanded, setIsUploadExpanded] = useState(true);
  const [isVerifyExpanded, setIsVerifyExpanded] = useState(true);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [verifyHistory, setVerifyHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1200);
    
    // Fetch user email from session
    fetch("http://localhost:5000/get-user-email", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.email);
        } else {
          console.error("Failed to fetch email");
        }
      })
      .catch((err) => console.error("Error fetching user email:", err));
  }, []);

  useEffect(() => {
    if (!email) return; // Wait until email is set

    // Fetch Uploaded Files
    fetch(`http://localhost:5000/api/uploaded-files?email=${email}`)
      .then((res) => res.json())
      .then((data) => setUploadHistory(data))
      .catch((err) => console.error("❌ Error fetching upload history:", err));

    // Fetch Verification Results
    fetch(`http://localhost:5000/api/verification-results?email=${email}`)
      .then((res) => res.json())
      .then((data) => setVerifyHistory(data))
      .catch((err) => console.error("❌ Error fetching verification history:", err));
  }, [email]);

  // Sample data for demo purposes - replace with actual data from API
  useEffect(() => {
    if (uploadHistory.length === 0) {
      setUploadHistory([
        { id: 1, filename: "evidence1.pdf", upload_timestamp: "2025-02-01T10:30:00Z", status: "Verified" },
        { id: 3, filename: "video.mp4", upload_timestamp: "2025-01-31T14:22:00Z", status: "Pending" },
        { id: 5, filename: "contract.pdf", upload_timestamp: "2025-01-28T09:15:00Z", status: "Verified" }
      ]);
    }
    
    if (verifyHistory.length === 0) {
      setVerifyHistory([
        { id: 2, filename: "document.jpg", verification_timestamp: "2025-02-01T11:45:00Z", verificationResult: "Authentic" },
        { id: 4, filename: "audio.wav", verification_timestamp: "2025-01-30T16:10:00Z", verificationResult: "Corrupted" },
        { id: 6, filename: "signature.png", verification_timestamp: "2025-01-25T13:20:00Z", verificationResult: "Authentic" }
      ]);
    }
  }, []);

  const statusColors = {
    Verified: "#10B981",
    Authentic: "#10B981",
    Pending: "#F59E0B",
    Corrupted: "#EF4444",
  };

  const statusIcons = {
    Verified: <CheckCircle size={14} />,
    Authentic: <Award size={14} />,
    Pending: <Clock size={14} />,
    Corrupted: <AlertTriangle size={14} />,
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <File size={22} color="#FF5757" />;
      case "jpg":
      case "png":
        return <File size={22} color="#5E72EB" />;
      case "mp4":
        return <File size={22} color="#8A3FFC" />;
      case "wav":
        return <File size={22} color="#00C9A7" />;
      default:
        return <FileText size={22} color="#FF9966" />;
    }
  };

  const LoadingSpinner = () => (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderTopColor: "#4F46E5",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const renderHistoryItem = (item, index, items, sectionType) => {
    const isUploaded = sectionType === "upload";
    const status = item.status || item.verificationResult;
    const timestamp = new Date(item.upload_timestamp || item.verification_timestamp);
    const isSelected = selectedItem && selectedItem.id === item.id;
    
    return (
      <div
        key={item.id}
        style={{
          padding: "1.25rem",
          borderRadius: "0.75rem",
          margin: "0 0.75rem 0.75rem",
          backgroundColor: isSelected ? "#F7F9FF" : "white",
          boxShadow: isSelected 
            ? "0 8px 20px rgba(79, 70, 229, 0.15)" 
            : "0 4px 12px rgba(0, 0, 0, 0.03)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          border: isSelected 
            ? "1px solid rgba(79, 70, 229, 0.2)" 
            : "1px solid rgba(226, 232, 240, 0.8)",
          position: "relative",
          overflow: "hidden",
          transform: isSelected ? "scale(1.02)" : "scale(1)",
          zIndex: isSelected ? 5 : 1,
        }}
        onClick={() => setSelectedItem(isSelected ? null : item)}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.08)";
            e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.03)";
            e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.8)";
          }
        }}
      >
        {/* Animated background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isUploaded 
              ? "radial-gradient(circle at top right, rgba(79, 70, 229, 0.08) 0%, rgba(94, 114, 235, 0) 70%)" 
              : "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%)",
            opacity: isSelected ? 1 : 0,
            transition: "opacity 0.4s ease",
            zIndex: -1,
          }}
        />

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem", 
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{
            backgroundColor: isUploaded ? "#EEF0FF" : "#ECFDF5",
            borderRadius: "12px",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isSelected ? "scale(1.1)" : "scale(1)",
            boxShadow: isSelected 
              ? `0 6px 16px ${isUploaded ? "rgba(79, 70, 229, 0.2)" : "rgba(16, 185, 129, 0.2)"}` 
              : "none",
          }}>
            {getFileIcon(item.filename)}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ 
              fontWeight: "600", 
              color: "#1E293B", 
              fontSize: "1rem",
              marginBottom: "0.5rem",
              transition: "color 0.3s ease",
              color: isSelected ? (isUploaded ? "#4F46E5" : "#059669") : "#1E293B",
            }}>
              {item.filename}
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: "0.8rem", 
              color: "#64748B",
              alignItems: "center"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <Calendar size={14} color="#94A3B8" />
                <span>
                  {timestamp.toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <span style={{
                color: statusColors[status],
                fontWeight: "600",
                backgroundColor: `${statusColors[status]}15`,
                padding: "0.35rem 0.85rem",
                borderRadius: "2rem",
                fontSize: "0.75rem",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                boxShadow: `0 2px 6px ${statusColors[status]}15`,
                transition: "all 0.3s ease",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
              }}>
                {statusIcons[status]}
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabBar = () => (
    <div style={{
      display: "flex",
      gap: "0.5rem",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      padding: "0.3rem",
      borderRadius: "1rem",
      marginBottom: "1.5rem",
      backdropFilter: "blur(8px)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      position: "relative",
      zIndex: 10,
    }}>
      {["all", "upload", "verify"].map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            border: "none",
            backgroundColor: activeTab === tab ? "white" : "transparent",
            color: activeTab === tab ? "#1E293B" : "#64748B",
            fontWeight: activeTab === tab ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: activeTab === tab ? "0 2px 10px rgba(0, 0, 0, 0.05)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          {tab === "all" && <Clock size={18} />}
          {tab === "upload" && <Upload size={18} />}
          {tab === "verify" && <CheckCircle size={18} />}
          {tab === "all" ? "All Activity" : tab === "upload" ? "Uploads" : "Verifications"}
        </button>
      ))}
    </div>
  );

  const renderSection = (title, icon, items, isExpanded, setExpanded, sectionType, gradientColors) => (
    <div style={{ 
      borderRadius: "1rem",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      background: "white",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      transform: "translateY(0)",
      opacity: 1,
      animation: "fadeIn 0.6s ease-out",
    }}>
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          cursor: "pointer",
          userSelect: "none",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: gradientColors,
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => setExpanded(!isExpanded)}
      >
        {/* Animated background pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 20% 85%, rgba(255, 255, 255, 0.4) 0%, transparent 25%), 
                           radial-gradient(circle at 80% 15%, rgba(255, 255, 255, 0.4) 0%, transparent 25%)`,
          animation: "pulse 8s infinite alternate ease-in-out",
        }}></div>
        
        {/* Floating icon in background */}
        <div style={{ 
          position: "absolute", 
          right: "-10px", 
          bottom: "-10px", 
          opacity: 0.15,
          transform: "rotate(-10deg)",
          transition: "all 0.5s ease",
          animation: "float 5s infinite ease-in-out",
        }}>
          {sectionType === "upload" ? 
            <CloudUpload size={90} /> :
            <Shield size={90} />}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", zIndex: 2 }}>
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.75rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
          }}>
            {icon}
          </div>
          <span style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}>{title}</span>
          <span style={{ 
            fontSize: "0.8rem", 
            backgroundColor: "rgba(255, 255, 255, 0.3)", 
            color: "white", 
            padding: "0.25rem 0.75rem", 
            borderRadius: "1rem", 
            marginLeft: "0.75rem",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
          }}>
            {items.length}
          </span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          transition: "all 0.3s ease",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <ChevronDown size={20} />
        </div>
      </div>

      <div style={{ 
        maxHeight: isExpanded ? "100%" : "0", 
        overflow: "auto",
        flexGrow: 1,
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: isExpanded ? "0.75rem 0" : "0",
        backgroundColor: "#F8FAFC",
      }}>
        {items.length > 0 ? (
          <div style={{
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.4s ease",
            transitionDelay: isExpanded ? "0.1s" : "0s",
          }}>
            {items.map((item, index) => renderHistoryItem(item, index, items, sectionType))}
          </div>
        ) : (
          <div style={{ 
            padding: "2.5rem", 
            textAlign: "center", 
            color: "#94A3B8", 
            fontStyle: "italic", 
            fontSize: "0.9rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.4s ease",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              animation: "pulse 3s infinite ease-in-out",
            }}>
              {sectionType === "upload" ? 
                <CloudUpload size={40} color="#CBD5E1" /> :
                <Shield size={40} color="#CBD5E1" />
              }
            </div>
            <span>No recent activity found</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnimatedBackground = () => (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      zIndex: -1,
    }}>
      <div style={{
        position: "absolute",
        top: "-300px",
        right: "-300px",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0) 70%)",
        filter: "blur(40px)",
        animation: "float 15s infinite alternate ease-in-out",
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-200px",
        left: "-200px",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)",
        filter: "blur(40px)",
        animation: "float 12s infinite alternate-reverse ease-in-out",
        animationDelay: "2s",
      }}></div>
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(247, 144, 9, 0.1) 0%, rgba(247, 144, 9, 0) 70%)",
        filter: "blur(40px)",
        animation: "float 18s infinite alternate ease-in-out",
        animationDelay: "4s",
      }}></div>
    </div>
  );

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(-10deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.8);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
      
      {isLoading && <LoadingSpinner />}
      
      {renderAnimatedBackground()}
      
      <div style={{ 
        padding: "2.5rem", 
        paddingTop: "80px", 
        background: "linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)",
        minHeight: "100vh",
        position: "relative",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ 
          marginBottom: "2rem",
          animation: "fadeIn 0.6s ease-out",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ 
              fontSize: "1.75rem", 
              fontWeight: "bold", 
              color: "#1E293B", 
              display: "flex", 
              alignItems: "center", 
              gap: "1rem", 
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
              }}>
                <Clock size={32} color="#4F46E5" />
              </div>
              <span>Activity Dashboard</span>
            </div>
            
            {renderTabBar()}
          </div>
         
        </div>

        {activeTab === "all" ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "2rem",
            height: "calc(100vh - 250px)",
            animation: "fadeIn 0.6s ease-out",
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              animation: "fadeIn 0.6s ease-out",
              animationDelay: "0.1s",
              opacity: isLoading ? 0 : 1,
            }}>
              {renderSection(
                "Uploaded Files", 
                <Upload size={20} color="white" />, 
                uploadHistory, 
                isUploadExpanded, 
                setIsUploadExpanded,
                "upload",
                "linear-gradient(135deg, #5E72EB 0%, #4F46E5 100%)"
              )}
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              animation: "fadeIn 0.6s ease-out",
              animationDelay: "0.2s",
              opacity: isLoading ? 0 : 1,
            }}>
              {renderSection(
                "Verified Documents", 
                <CheckCircle size={20} color="white" />, 
                verifyHistory, 
                isVerifyExpanded, 
                setIsVerifyExpanded,
                "verify",
                "linear-gradient(135deg, #06B6D4 0%, #059669 100%)"
              )}
            </div>
          </div>
        ) : activeTab === "upload" ? (
          <div style={{ 
            height: "calc(100vh - 250px)",
            animation: "fadeIn 0.6s ease-out",
          }}>
            {renderSection(
              "Uploaded Files", 
              <Upload size={20} color="white" />, 
              uploadHistory, 
              true, 
              () => {},
              "upload",
              "linear-gradient(135deg, #5E72EB 0%, #4F46E5 100%)"
            )}
          </div>
        ) : (
          <div style={{ 
            height: "calc(100vh - 250px)",
            animation: "fadeIn 0.6s ease-out",
          }}>
            {renderSection(
              "Verified Documents", 
              <CheckCircle size={20} color="white" />, 
              verifyHistory, 
              true, 
              () => {},
              "verify",
              "linear-gradient(135deg, #06B6D4 0%, #059669 100%)"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;