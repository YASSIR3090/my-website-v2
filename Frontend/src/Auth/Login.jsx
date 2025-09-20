import React, { useState } from "react";
import bgImage from "../Imgs/zawaBg.jpg";
import { Link, useNavigate } from 'react-router-dom';

function Login({ apiBaseUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Send login request to backend API
      const response = await fetch(`${apiBaseUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful login
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authToken', data.token); // Store token if provided
        
        console.log("Login successful!");
        navigate('/dashboard');
      } else {
        // Failed login
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow border-0 rounded-4 p-4 bg-light"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center display-6 mt-2">Login</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-3 border-2"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-3 border-2"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary border-0 rounded-3 w-100 mb-3 py-2 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="d-flex justify-content-between mb-3">
            <Link to="/register" className="text-decoration-none">Not Registered?</Link>
            <Link to="/reset" className="text-decoration-none">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;