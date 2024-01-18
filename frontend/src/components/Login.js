import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const url = "http://localhost:8060/auth/login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        email,
        password,
      });

      if (response.status === 200) {
        // save other data in the session storage
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("username", response.data.name);
        document.cookie = "token=" + response.data.token;
        sessionStorage.setItem("username", response.data.name);
        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        console.error("Signup failed:", response.data);
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred. Please check your internet connection and try again."
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-title">
        <h4> Login </h4>{" "}
      </div>{" "}
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="email"> Email: </label>{" "}
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password"> Password: </label>{" "}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">
          Login{" "}
        </button>{" "}
        {error && <p className="error-message"> {error} </p>}{" "}
        <p style={{ textAlign: "center", margin: "1rem" }}>
          Don 't have an account? <Link to="/signup">Sign Up</Link>{" "}
        </p>{" "}
      </form>{" "}
    </div>
  );
};

export default Login;
