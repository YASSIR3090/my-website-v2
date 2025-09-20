
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "../Imgs/zawaBg.jpg";
import { Link, useNavigate } from "react-router-dom";

function Register({ apiBaseUrl }) {
  const [formData, setFormData] = useState({
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
    password: "",
    confirmPassword: ""
  });

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [educationCertificate, setEducationCertificate] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e, setFile, setPreview = null) => {
    const file = e.target.files[0];
    if (file) {
      const inputId = e.target.id;
      let isValid = false;

      if (inputId === "passportPhoto") {
        isValid =
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png";
      } else if (
        inputId === "birthCertificate" ||
        inputId === "educationCertificate"
      ) {
        isValid = file.type === "application/pdf";
      }

      if (isValid) {
        setFile(file);

        if (setPreview && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (inputId === "passportPhoto") {
          alert("Please upload a JPG or PNG file only for passport photo");
        } else {
          alert("Please upload a PDF file only for certificates");
        }
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (!passportPhoto || !birthCertificate || !educationCertificate) {
      setError("Please upload all required documents");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // 🟢 snake_case to match Django serializer
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("middle_name", formData.middleName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("date_of_birth", formData.dateOfBirth);
      formDataToSend.append("phone_number", formData.phoneNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("id_number", formData.idNumber);
      formDataToSend.append("marital_status", formData.maritalStatus);
      formDataToSend.append("form_four_number", formData.formFourNumber);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirm_password", formData.confirmPassword);

      formDataToSend.append("passport_photo", passportPhoto);
      formDataToSend.append("birth_certificate", birthCertificate);
      formDataToSend.append("education_certificate", educationCertificate);

      console.log("Sending request to:", `${apiBaseUrl}/register/`);

      const response = await fetch(`${apiBaseUrl}/register/`, {
        method: "POST",
        body: formDataToSend
      });

      const data = await response.json();
      console.log("Status:", response.status);
      console.log("Response from server:", data);

      if (response.ok && data.success) {
        // Store ALL user data in localStorage for dashboard display
        const userDataToStore = {
          id: data.user.id,
          email: formData.email,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          idNumber: formData.idNumber,
          maritalStatus: formData.maritalStatus,
          formFourNumber: formData.formFourNumber,
          registrationDate: new Date().toISOString().split('T')[0],
          profilePhoto: null,
          documents: {
            passportPhoto: passportPhotoPreview || null,
            birthCertificate: birthCertificate ? "Available" : null,
            educationCertificate: educationCertificate ? "Available" : null
          }
        };

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(userDataToStore));
        localStorage.setItem("userEmail", formData.email);

        // Save registration data for admin (Management.jsx)
        const registrationData = {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          idNumber: formData.idNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          maritalStatus: formData.maritalStatus,
          formFourNumber: formData.formFourNumber,
          registrationDate: new Date().toLocaleString()
        };

        // Get existing registrations or initialize empty array
        const existingRegistrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
        existingRegistrations.push(registrationData);
        localStorage.setItem('userRegistrations', JSON.stringify(existingRegistrations));

        alert("Registration successful!");
        navigate("/dashboard");
      } else {
        if (data.errors) {
          // Format validation errors for better display
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%"
      }}
    >
      <div className="container col-md-10 col-lg-8">
        <div className="card shadow border-0 rounded-9 overflow-hidden">
          <div className="card-header bg-primary text-white text-center py-3">
            <h3 className="mb-0">Registration</h3>
          </div>

          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 border-2"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="middleName" className="form-label">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 border-2"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 border-2"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-3 border-2"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number (Tanzania) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">+255</span>
                    <input
                      type="tel"
                      className="form-control rounded-3 border-2"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="712345678"
                      pattern="[0-9]{9}"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <small className="text-muted">
                    Format: 712345678 (9 digits)
                  </small>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-3 border-2"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select rounded-3 border-2"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="idNumber" className="form-label">
                    ID Number (Tanzania) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 border-2"
                    id="idNumber"
                    name="idNumber"
                    placeholder="e.g. 1234567890123456"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="maritalStatus" className="form-label">
                    Marital Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select rounded-3 border-2"
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="formFourNumber" className="form-label">
                    Form Four Certificate Number{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3 border-2"
                    id="formFourNumber"
                    name="formFourNumber"
                    value={formData.formFourNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-3 border-2"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <small className="text-muted">Minimum 6 characters</small>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-3 border-2"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="passportPhoto" className="form-label">
                    Passport Photo (JPG/PNG){" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control rounded-3 border-2"
                    id="passportPhoto"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(e, setPassportPhoto, setPassportPhotoPreview)
                    }
                    required
                    disabled={isLoading}
                  />
                  {passportPhotoPreview && (
                    <div className="mt-2">
                      <img
                        src={passportPhotoPreview}
                        alt="Passport preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "100px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="birthCertificate" className="form-label">
                    Birth Certificate (PDF){" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control rounded-3 border-2"
                    id="birthCertificate"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setBirthCertificate)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="educationCertificate" className="form-label">
                    Education Certificate (PDF){" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control rounded-3 border-2"
                    id="educationCertificate"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setEducationCertificate)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Link to="/login" className="btn btn-outline-secondary rounded-3">
                  Back to Login
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 px-4 py-2 fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
