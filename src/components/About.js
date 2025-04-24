import React from "react";
import "./About.css";
import { FaLock, FaGlobe, FaLightbulb, FaUserShield, FaUsers } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaLock />,
      title: "Secure Access",
      text: "Multi-role support (Admin, Moderator, User) ensures secure, personalized experiences for every user.",
    },
    {
      icon: <FaUserShield />,
      title: "Data Ownership",
      text: "Take full control of your digital identity with privacy-first data management.",
    },
    {
      icon: <FaGlobe />,
      title: "Decentralized Trust",
      text: "Manage your personal data without the fear of third-party exploitation.",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation Driven",
      text: "Built with React, Node.js, and JWT — always evolving with modern tech.",
    },
    {
      icon: <FaUsers />,
      title: "Community-Focused",
      text: "We're building Personicle with you — join us in reshaping the digital world ethically.",
    },
  ];

  return (
    <div className="about-container">
      <h2 className="about-title">About Personicle</h2>
      <div className="about-cards-wrapper">
        {features.map((feature, index) => (
          <div key={index} className="about-card">
            <div className="icon">{feature.icon}</div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
