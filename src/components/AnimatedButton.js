import React from "react";
import "./AnimatedButton.css";

const AnimatedButton = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button type={type} onClick={onClick} className={`animated-button ${className}`}>
      {children}
    </button>
  );
};

export default AnimatedButton;
