import React from "react";
import { Link } from "react-router-dom";
// import styles from "./header.module.css"; // Import CSS module

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo"> Group Watch </h1>

      <ul className="nav">
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
