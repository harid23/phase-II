import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <>
      <footer className="footer bg-dark text-white pt-4 pb-2 mt-5">
        <div className="container">
          <div className="row text-start">

            {/* Company Info */}
            <div className="col-md-4 mb-3">
              <h5>QuitQ E-Commerce</h5>
              <p>Revolutionizing online shopping with fast delivery and quality assurance.</p>
            </div>

            {/* Contact Info */}
            <div className="col-md-4 mb-3">
              <h5>Contact Us</h5>
              <p>Email: support@quitq.com</p>
              <p>Toll-Free: 1800-123-QUIT (7848)</p>
              <p>Head Office: Chennai, India</p>
            </div>

            {/* Social Media */}
            <div className="col-md-4 mb-3">
              <h5>Follow Us</h5>
              <div className="d-flex gap-3 fs-5 social-icons">
                <a href="#" className="text-white" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-white" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

          </div>

          <hr className="bg-light" />
          <p className="text-center mb-0">&copy; 2025 QuitQ E-Commerce. All rights reserved.</p>
        </div>
      </footer>

      {/* Inline CSS */}
      <style>{`
        .footer a:hover {
          color: #0d6efd !important;
          transition: color 0.3s ease;
        }
        .social-icons a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.1);
        }
        .social-icons a:hover {
          background-color: rgba(255,255,255,0.3);
        }
      `}</style>
    </>
  );
}
