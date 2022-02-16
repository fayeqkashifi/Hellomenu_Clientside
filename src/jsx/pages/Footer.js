import React from "react";
import { Link } from "react-router-dom";
const Footer = (props) => {
  return (
    <div className="row mb-1" style={{  position: "fixed",
    bottom: 0,
    width: "100%"}}>
      <div className="d-flex justify-content-center">
        <Link className="mx-2" to="/forgot-password">
          Terms of Service
        </Link>
        <span>&#x2022;</span>
        <Link className="mx-2" to="/user-register">
          Privacy Policy
        </Link>{" "}
      </div>
    </div>
  );
};

export default Footer;
