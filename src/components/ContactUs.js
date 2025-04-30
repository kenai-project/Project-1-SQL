import React from "react";
import "./ContactUs.css"; // Import the CSS file for styling

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>
        <span role="img" aria-label="email">📧</span> <strong>Email:</strong>{" "}
        <a href="mailto:support@personicle.com">support@personicle.com</a>
      </p>
      <p>
        <span role="img" aria-label="phone">📞</span> <strong>Phone:</strong>{" "}
        <a href="tel:+1234567890">+123-456-7890</a>
      </p>
    </div>
  );
};

export default ContactUs;
