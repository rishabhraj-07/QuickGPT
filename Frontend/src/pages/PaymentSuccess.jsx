import React from "react";
import "./PaymentSuccess.css";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <svg
            className="success-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Your transaction has been completed successfully.
        </p>
        <br />
        <Link to="/" className="link">
          Go to Home <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
