import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div
      className="footer"
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        height: "30px",
      }}
    >
      <div className="text-center">
        <p>
          Copyright © Designed &amp; Developed by{" "}
          <Link to="http://www.big-dash.com/" target="_blank">
            Big-Dash
          </Link>{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
