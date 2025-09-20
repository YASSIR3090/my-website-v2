
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

function Dashboard({ apiBaseUrl }) {
  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    gender: "",
    idNumber: "",
    maritalStatus: "",
    formFourNumber: "",
    registrationDate: new Date().toISOString().split('T')[0],
    profilePhoto: null,
    documents: {
      passportPhoto: null,
      birthCertificate: null,
      educationCertificate: null
    }
  });

  const [profileCompletion, setProfileCompletion] = useState(85);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Get user data from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // Merge stored data with default structure to ensure all fields exist
      const mergedUserData = {
        ...userData,
        ...currentUser,
        documents: {
          ...userData.documents,
          ...(currentUser.documents || {})
        }
      };
      setUserData(mergedUserData);
      
      // Update profile completion based on whether profile photo exists
      if (mergedUserData.profilePhoto) {
        setProfileCompletion(95); // Higher completion if profile photo is uploaded
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavClick = (item) => {
    setActiveItem(item);
  };

  // Function to create and download a PDF certificate
  const downloadCertificatePDF = (type, userData) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add certificate background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add header
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('ZAWA EMPLOYMENT SYSTEM', 105, 25, { align: 'center' });
    
    // Add certificate title
    doc.setTextColor(13, 110, 253);
    doc.setFontSize(18);
    doc.text(type === 'birth' ? 'BIRTH CERTIFICATE' : 'EDUCATION CERTIFICATE', 105, 60, { align: 'center' });
    
    // Add decorative elements
    doc.setDrawColor(13, 110, 253);
    doc.setLineWidth(1);
    doc.line(50, 65, 160, 65);
    
    // Add user information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    const yStart = 80;
    let y = yStart;
    
    doc.setFont(undefined, 'bold');
    doc.text('FULL NAME:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`, 80, y);
    
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('DATE OF BIRTH:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(userData.dateOfBirth || 'Not provided', 80, y);
    
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('GENDER:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(userData.gender || 'Not provided', 80, y);
    
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('ID NUMBER:', 30, y);
    doc.setFont(undefined, 'normal');
    doc.text(userData.idNumber || 'Not provided', 80, y);
    
    if (type === 'education') {
      y += 10;
      doc.setFont(undefined, 'bold');
      doc.text('FORM FOUR NUMBER:', 30, y);
      doc.setFont(undefined, 'normal');
      doc.text(userData.formFourNumber || 'Not provided', 80, y);
    }
    
    y += 20;
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICATE DETAILS:', 30, y);
    y += 10;
    doc.setFont(undefined, 'normal');
    doc.text(type === 'birth' 
      ? 'This is to certify that the above information is true and accurate according to our records.' 
      : 'This is to certify that the educational information provided is true and accurate according to our records.', 
    30, y, { maxWidth: 150 });
    
    // Add issue date
    y += 20;
    doc.setFont(undefined, 'italic');
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 30, y);
    
    // Add signature area
    y += 30;
    doc.setDrawColor(0, 0, 0);
    doc.line(30, y, 80, y);
    doc.text('Authorized Signature', 30, y + 5);
    
    // Add stamp
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(1);
    doc.circle(160, y - 10, 15);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text('OFFICIAL', 160, y - 13, { align: 'center' });
    doc.text('STAMP', 160, y - 5, { align: 'center' });
    
    // Add footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text('ZAWA Employment System - Certificate Verification', 105, 280, { align: 'center' });
    doc.text('https://zawa-employmentsystem.vercel.app', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`${type === 'birth' ? 'birth_certificate' : 'education_certificate'}_${userData.idNumber || 'document'}.pdf`);
  };

  // Function to handle document download
  const handleDownload = (documentData, fileName, documentType) => {
    if (documentType === 'birth' || documentType === 'education') {
      // Generate and download PDF certificate
      downloadCertificatePDF(documentType, userData);
      return;
    }
    
    if (!documentData || documentData === "Available" || documentData === null) {
      alert("Document not available for download");
      return;
    }
    
    try {
      // If it's a data URL (image), download as image
      if (typeof documentData === 'string' && documentData.startsWith('data:image/')) {
        const link = document.createElement('a');
        link.href = documentData;
        link.download = fileName || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      // If it's a file path or URL
      else if (typeof documentData === 'string') {
        // For external URLs, open in new tab
        window.open(documentData, '_blank');
      } 
      // If it's a file object (from input)
      else if (documentData instanceof File) {
        const url = URL.createObjectURL(documentData);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || documentData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the URL object
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading document. Please try again.");
    }
  };

  // Function to handle document viewing
  const handleView = (documentData, documentType) => {
    if (documentType === 'birth' || documentType === 'education') {
      // For certificates, download the PDF first
      downloadCertificatePDF(documentType, userData);
      return;
    }
    
    if (!documentData || documentData === "Available" || documentData === null) {
      alert("Document not available for viewing");
      return;
    }
    
    try {
      // If it's a data URL (image), open in new tab
      if (typeof documentData === 'string' && documentData.startsWith('data:image/')) {
        const newTab = window.open();
        newTab.document.write(`
          <html>
            <head><title>Document View</title></head>
            <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8f9fa;">
              <img src="${documentData}" style="max-width: 100%; max-height: 100vh; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            </body>
          </html>
        `);
        newTab.document.close();
      } 
      // If it's a file path or URL
      else if (typeof documentData === 'string') {
        // For external URLs, open in new tab
        window.open(documentData, '_blank');
      }
      // If it's a file object (from input)
      else if (documentData instanceof File) {
        const url = URL.createObjectURL(documentData);
        window.open(url, '_blank');
        // Note: We can't revoke the URL immediately as the new tab needs it
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error("View error:", error);
      alert("Error viewing document. Please try again.");
    }
  };

  // Function to check if a document is available
  const isDocumentAvailable = (documentData) => {
    return documentData && documentData !== "Available" && documentData !== null;
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div 
        className={`bg-primary text-white vh-100 p-3 position-fixed sidebar-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ zIndex: 1000 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!sidebarCollapsed && <h5 className="text-center mb-0">User Dashboard</h5>}
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="nav flex-column">
          <Link 
            to="/dashboard" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <i className="fas fa-home me-3"></i>
            {!sidebarCollapsed && <span>Overview</span>}
          </Link>
          <Link 
            to="/jobs" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'jobs' ? 'active' : ''}`}
            onClick={() => handleNavClick('jobs')}
          >
            <i className="fas fa-briefcase me-3"></i>
            {!sidebarCollapsed && <span>Jobs</span>}
          </Link>
          <Link 
            to="/applications" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'applications' ? 'active' : ''}`}
            onClick={() => handleNavClick('applications')}
          >
            <i className="fas fa-file-alt me-3"></i>
            {!sidebarCollapsed && <span>Applications</span>}
          </Link>
          
          <Link 
            to="/profile" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <i className="fas fa-user me-3"></i>
            {!sidebarCollapsed && <span>Profile</span>}
          </Link>
          
          <div className="mt-auto">
            <Link 
              to="/login" 
              className="text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item"
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('currentUser');
              }}
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              {!sidebarCollapsed && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-grow-1 p-4 content-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        {/* Toggle button for mobile */}
        <button 
          className="btn btn-primary d-md-none position-fixed m-3"
          style={{ zIndex: 1001 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <span className="fw-bold">{userData.firstName} {userData.lastName}</span>
            </div>
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center overflow-hidden" 
                 style={{ width: "50px", height: "50px", border: "2px solid #dee2e6" }}>
              {userData.profilePhoto ? (
                <img 
                  src={userData.profilePhoto} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <i className="fas fa-user text-primary fs-5"></i>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Card with Big Image */}
        <div className="card border-0 shadow-sm mb-4 bg-primary text-white position-relative overflow-hidden">
          <div className="row g-0">
            <div className="col-md-8 p-4 d-flex flex-column justify-content-center">
              <h4 className="card-title">Karibu, {userData.firstName}!</h4>
              <p className="card-text">We're glad to have you on board. Here's your account overview.</p>
              <div className="d-flex mt-3">
                <Link to="/jobs" className="btn btn-light me-2">
                  <i className="fas fa-briefcase me-2"></i> Browse Jobs
                </Link>
                <Link to="/profile" className="btn btn-outline-light">
                  <i className="fas fa-user me-2"></i> View Profile
                </Link>
              </div>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <div className="position-relative h-100">
                <div 
                  className="position-absolute top-0 end-0 h-100 w-100 bg-cover"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')",
                    borderTopRightRadius: '0.375rem',
                    borderBottomRightRadius: '0.375rem'
                  }}
                ></div>
                <div className="position-absolute top-0 end-0 h-100 w-100 bg-primary opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Profile Completion */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 d-flex align-items-center">
                <i className="fas fa-tasks text-primary me-2"></i>
                <h5 className="mb-0">Profile Completion</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-grow-1">
                    <div className="progress" style={{ height: "10px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${profileCompletion}%` }}
                        aria-valuenow={profileCompletion} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="ms-3 fw-bold">{profileCompletion}%</div>
                </div>
                <p className="text-muted">Complete your profile to increase your chances of getting hired.</p>
                <Link to="/profile" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-user-edit me-1"></i> Complete Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 d-flex align-items-center">
                <i className="fas fa-user-check text-primary me-2"></i>
                <h5 className="mb-0">Account Status</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-check text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Verified Account</h6>
                    <small className="text-muted">Your account is active and verified</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Documents</h6>
                    <small className="text-muted">Under review</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="fas fa-user-circle text-primary me-2"></i>
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <Link to="/profile" className="btn btn-outline-primary btn-sm">
              <i className="fas fa-edit me-1"></i> Edit
            </Link>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-signature me-1 text-primary"></i> Full Name
                </label>
                <p className="fw-bold">{userData.firstName || "Not provided"} {userData.middleName || ""} {userData.lastName || ""}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-birthday-cake me-1 text-primary"></i> Date of Birth
                </label>
                <p className="fw-bold">{userData.dateOfBirth || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-phone me-1 text-primary"></i> Phone Number
                </label>
                <p className="fw-bold">{userData.phoneNumber ? `+255 ${userData.phoneNumber}` : "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-envelope me-1 text-primary"></i> Email Address
                </label>
                <p className="fw-bold">{userData.email || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-venus-mars me-1 text-primary"></i> Gender
                </label>
                <p className="fw-bold">{userData.gender || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-heart me-1 text-primary"></i> Marital Status
                </label>
                <p className="fw-bold">{userData.maritalStatus || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-id-card me-1 text-primary"></i> ID Number
                </label>
                <p className="fw-bold">{userData.idNumber || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-graduation-cap me-1 text-primary"></i> Form Four Number
                </label>
                <p className="fw-bold">{userData.formFourNumber || "Not provided"}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">
                  <i className="fas fa-calendar-alt me-1 text-primary"></i> Member Since
                </label>
                <p className="fw-bold">{userData.registrationDate || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 d-flex align-items-center">
            <i className="fas fa-file-alt text-primary me-2"></i>
            <h5 className="mb-0">Documents</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 d-flex align-items-center">
                      <i className="fas fa-id-card me-2 text-primary"></i> Passport Photo
                    </h6>
                    <span className={`badge ${isDocumentAvailable(userData.documents?.passportPhoto) ? 'bg-success' : 'bg-warning'}`}>
                      {isDocumentAvailable(userData.documents?.passportPhoto) ? 'Available' : 'Pending'}
                    </span>
                  </div>
                  <small className="text-muted">JPG/PNG Image</small>
                  <div className="mt-3">
                    {isDocumentAvailable(userData.documents?.passportPhoto) ? (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleView(userData.documents.passportPhoto, 'passport')}
                        >
                          <i className="fas fa-eye me-1"></i> View
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleDownload(userData.documents.passportPhoto, 'passport_photo.jpg', 'passport')}
                        >
                          <i className="fas fa-download me-1"></i> Download
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">No document uploaded</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 d-flex align-items-center">
                      <i className="fas fa-certificate me-2 text-primary"></i> Birth Certificate
                    </h6>
                    <span className="badge bg-info">PDF Download</span>
                  </div>
                  <small className="text-muted">Official PDF Certificate</small>
                  <div className="mt-3">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleView(null, 'birth')}
                      >
                        <i className="fas fa-eye me-1"></i> View
                      </button>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDownload(null, 'birth_certificate.pdf', 'birth')}
                      >
                        <i className="fas fa-download me-1"></i> Download
                      </button>
                    </div>
                    <small className="text-muted d-block mt-2">Generates official PDF certificate</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="border rounded p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 d-flex align-items-center">
                      <i className="fas fa-graduation-cap me-2 text-primary"></i> Education Certificate
                    </h6>
                    <span className="badge bg-info">PDF Download</span>
                  </div>
                  <small className="text-muted">Official PDF Certificate</small>
                  <div className="mt-3">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleView(null, 'education')}
                      >
                        <i className="fas fa-eye me-1"></i> View
                      </button>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDownload(null, 'education_certificate.pdf', 'education')}
                      >
                        <i className="fas fa-download me-1"></i> Download
                      </button>
                    </div>
                    <small className="text-muted d-block mt-2">Generates official PDF certificate</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add CSS for transitions and sidebar behavior */}
        <style>
          {`
            .sidebar-transition {
              width: 250px;
              transition: width 0.3s ease;
            }
            
            .sidebar-transition.collapsed {
              width: 70px;
            }
            
            .content-transition {
              margin-left: 250px;
              transition: margin-left 0.3s ease;
            }
            
            .content-transition.collapsed {
              margin-left: 70px;
            }
            
            .nav-item.active {
              background-color: rgba(255, 255, 255, 0.2) !important;
            }
            
            .nav-item:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }
            
            .bg-cover {
              background-size: cover;
              background-position: center;
            }
            
            @media (max-width: 768px) {
              .sidebar-transition {
                width: 250px;
                left: -250px;
              }
              
              .sidebar-transition.collapsed {
                left: 0;
              }
              
              .content-transition {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Dashboard;
