import React, { useRef, useState, useEffect } from 'react';
import { Shield, Download, Mail, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';

const CertificateGenerator = () => {
  const certificateRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [username, setUsername] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/get-user-email', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEmail(data.email);
  
          // Fetch username using the retrieved email
          fetch('http://localhost:5000/get-username', { credentials: 'include' })
            .then(response => response.json())
            .then(userData => {
              if (userData.success) {
                setUsername(userData.username);
              } else {
                console.error("Failed to retrieve username:", userData.message);
              }
            })
            .catch(error => console.error("Error fetching username:", error));
        } else {
          console.error("Failed to retrieve email:", data.message);
        }
      })
      .catch(error => console.error("Error fetching email:", error));
  }, []);
  

  useEffect(() => {
    const storedFileName = location.state?.fileName || localStorage.getItem("uploadedFileName");
    if (storedFileName) {
      setUploadedFileName(storedFileName);
    }
  }, [location.state]);

  const uniqueID = location.state?.uniqueID || "N/A";
  const currentDate = new Date().toLocaleDateString();

  const handleDownload = async () => {
    const certificate = certificateRef.current;
    const canvas = await html2canvas(certificate, { scale: 2 });
    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 190);
    pdf.save(`certificate-${uniqueID}.pdf`);

    if (sendEmail && email) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('certificate', new Blob([pdf.output('blob')], { type: 'application/pdf' }), `certificate-${uniqueID}.pdf`);

      try {
        const response = await fetch('http://localhost:5000/send-certificate', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          alert(`Certificate sent successfully to ${email}!`);
        } else {
          //alert('Failed to send certificate.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error sending certificate.');
      }
    }

    navigate('/button');
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div ref={certificateRef} style={{
        maxWidth: '800px', margin: '60px auto', padding: '40px',
        border: '3px solid #1E3A8A', borderRadius: '15px', textAlign: 'center',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)',
      }}>
        <Shield size={50} style={{ color: '#1E3A8A' }} />
        <h1 style={{ color: '#1E3A8A', fontSize: '24px', fontWeight: 'bold' }}>Evidence Protection</h1>
        <h2 style={{ color: '#1E3A8A', fontSize: '20px' }}>Certificate of Integrity Verification</h2>
        
        <p style={{ color: '#4B5563', fontSize: '16px' }}>This certifies that</p>
        <div style={{
          fontSize: '28px', fontWeight: 'bold', color: '#2563EB',
          borderBottom: '2px solid #1E3A8A', display: 'inline-block', padding: '0 20px'
        }}>
          {username || "Unknown User"}
        </div>

        <p style={{ color: '#4B5563', fontSize: '16px' }}>
          <span>Email: </span>
          <strong style={{ color: '#2563EB' }}>{email || "No Email Available"}</strong>
        </p>

        <p style={{ color: '#4B5563', fontSize: '16px' }}>has successfully uploaded on: {currentDate} and file name is </p>

        <div style={{
          fontSize: '24px', fontWeight: 'bold', color: '#D97706',
          borderBottom: '2px solid #D97706', display: 'inline-block', padding: '0 20px'
        }}>
          {uploadedFileName || "No File Selected"}
        </div>

        <p style={{ color: '#4B5563', fontSize: '16px', fontWeight: 'bold' }}>Certificate ID: {uniqueID}</p>
      </div>

      {/* Email Delivery Section */}
      <div style={{
        background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)',
        borderRadius: '12px',
        padding: '20px',
        width: '100%',
        maxWidth: '500px',
        marginTop: '20px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        border: '2px solid #1E3A8A',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <Mail size={24} style={{ color: '#1E3A8A', marginRight: '10px' }} />
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1E3A8A' }}>
            Digital Delivery
          </div>
        </div>
        
        {email ? (
          <div style={{ background: 'rgba(30, 58, 138, 0.05)', borderRadius: '8px', padding: '12px 15px', marginBottom: '15px', color: '#2563EB', fontSize: '14px', border: '1px solid rgba(30, 58, 138, 0.1)' }}>
            <span style={{ color: '#4B5563' }}>Registered Email: </span>
            <strong>{email}</strong>
          </div>
        ) : (
          <div style={{ background: 'rgba(220, 38, 38, 0.05)', borderRadius: '8px', padding: '12px 15px', marginBottom: '15px', color: '#DC2626', fontSize: '14px', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
            <span>No registered email available</span>
          </div>
        )}

        <div 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            background: email ? 'rgba(30, 58, 138, 0.03)' : 'rgba(209, 213, 219, 0.2)',
            borderRadius: '8px', 
            padding: '12px 15px', 
            cursor: email ? 'pointer' : 'not-allowed',
            border: sendEmail ? '2px solid #2563EB' : '1px solid rgba(30, 58, 138, 0.1)',
            opacity: email ? 1 : 0.6,
            transition: 'all 0.2s ease'
          }} 
          onClick={() => email && setSendEmail(!sendEmail)}
        >
          <div style={{ 
            width: '22px', 
            height: '22px', 
            borderRadius: '6px', 
            background: sendEmail ? '#2563EB' : 'rgba(30, 58, 138, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}>
            {sendEmail && <Check size={16} style={{ color: 'white' }} />}
          </div>
          <span style={{ marginLeft: '10px', fontSize: '14px' }}>
            {email ? `Send certificate to ${email}` : "No email available for delivery"}
          </span>
        </div>
        
        {sendEmail && email && (
          <div style={{ 
            fontSize: '13px', 
            color: '#4B5563', 
            marginTop: '10px', 
            background: 'rgba(37, 99, 235, 0.05)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            border: '1px dashed rgba(37, 99, 235, 0.3)'
          }}>
            Your certificate will be sent to your email when you click the Download button
          </div>
        )}
      </div>

      <button onClick={handleDownload} style={{
        backgroundColor: '#1E3A8A', 
        color: 'white', 
        padding: '12px 24px',
        borderRadius: '8px', 
        fontSize: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: 'pointer', 
        border: 'none', 
        marginTop: '20px',
        transition: 'background-color 0.2s ease',
        boxShadow: '0 4px 6px rgba(30, 58, 138, 0.2)'
      }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'} 
         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'}>
        <Download size={20} /> {sendEmail && email ? 'Download & Send Certificate' : 'Download Certificate'}
      </button>
    </div>
  );
};

export default CertificateGenerator;