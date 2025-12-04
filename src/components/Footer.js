/**
 * Footer Component
 * 
 * A responsive footer that includes:
 * - Company description
 * - Quick navigation links
 * - Social media links
 * - Copyright information
 * 
 * The footer is divided into three main sections:
 * 1. About section with company description
 * 2. Quick links for navigation
 * 3. Social media connections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h3>Tech Blog</h3>
          <p>Your trusted source for the latest technology insights, trends, and updates. Stay informed with our expert analysis and in-depth coverage of the tech world.</p>
        </div>

        {/* Navigation Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Tech Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 