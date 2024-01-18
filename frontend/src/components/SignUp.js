import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const url = "http://localhost:8060/auth/register";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        name,
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Signup Successful", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        document.cookie = "token=" + response.data.token;
        // save other data in the session storage
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("username", response.data.name);
        setTimeout(() => {
          navigate("/login");
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
    <motion.div className="signup-container">
      <div className="signup-title">
        <h4> Sign Up </h4>{" "}
      </div>{" "}
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="name"> Name </label>{" "}
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email"> Email </label>{" "}
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password"> Password </label>{" "}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">
          Sign Up{" "}
        </button>{" "}
        {error && <p className="error-message"> {error} </p>}
        <p style={{ textAlign: "center", margin: "1rem" }}>
          Already have an account? <Link to="/login">Login</Link>{" "}
        </p>
      </form>{" "}
    </motion.div>
  );
};

export default SignUp;
