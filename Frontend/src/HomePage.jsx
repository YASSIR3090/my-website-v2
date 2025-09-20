import React from "react";
import { Link } from 'react-router-dom';
import zawaLogo from "./Imgs/zawaLogo.png";
import bgImage from "./Imgs/zawaBg.jpg";

function HomePage() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            {/* Logo and Heading */}
            <div className="mb-5">
              <img
                src={zawaLogo}
                alt="Zawamis Logo"
                className="img-fluid mb-4"
                style={{ maxHeight: "120px", filter: "brightness(0) invert(1)" }}
              />
              <h1 className="text-white display-3 fw-bold mb-3">Welcom our jobsite</h1>
              <p className="text-white lead mb-5">
                Tanzania's Premier Job Portal - Connecting Talent with Opportunity
              </p>
            </div>
            
            {/* Login Options */}
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6 mb-4">
                <div className="card shadow border-0 rounded-4 h-100 hover-card">
                  <div className="card-body p-5 text-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                         style={{ width: "90px", height: "90px" }}>
                      <i className="fas fa-user-tie text-primary fs-1"></i>
                    </div>
                    <h3 className="card-title mb-3">Job Seeker</h3>
                    <p className="card-text text-muted mb-4">
                      Access your personal dashboard to browse jobs, submit applications, and manage your profile.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg w-100 py-3 fw-bold">
                      <i className="fas fa-sign-in-alt me-2"></i> 
                      User Login
                    </Link>
                    <div className="mt-3">
                      <small className="text-muted">
                        Don't have an account? <Link to="/register" className="text-decoration-none">Register Now</Link>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-5 col-md-6 mb-4">
                <div className="card shadow border-0 rounded-4 h-100 hover-card">
                  <div className="card-body p-5 text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                         style={{ width: "90px", height: "90px" }}>
                      <i className="fas fa-user-cog text-success fs-1"></i>
                    </div>
                    <h3 className="card-title mb-3">Administrator</h3>
                    <p className="card-text text-muted mb-4">
                      Access the admin panel to manage users, job postings, and applications across the platform.
                    </p>
                    <Link to="/admin-login" className="btn btn-success btn-lg w-100 py-3 fw-bold">
                      <i className="fas fa-lock me-2"></i> 
                      Admin Login
                    </Link>
                    <div className="mt-3">
                      <small className="text-muted">
                        Restricted to authorized personnel only
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-5 pt-4">
              <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">1000+ Jobs</h5>
                      <small>Available Positions</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-users"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">5000+ Users</h5>
                      <small>Registered Job Seekers</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center text-white">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-building"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">200+ Companies</h5>
                      <small>Trusted Employers</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Information */}
            <div className="mt-5">
              <p className="text-white mb-2">
                Need assistance? Contact our support team
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="text-white text-decoration-none">
                  <i className="fas fa-envelope me-1"></i> support@zawamis.com
                </a>
                <span className="text-white">|</span>
                <a href="#" className="text-white text-decoration-none">
                  <i className="fas fa-phone me-1"></i> +255 754 000 000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
          }
          .card {
            border: none;
          }
          .btn {
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;