import React from "react";
import "./PaymentSuccess.css";

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
      </div>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default PaymentSuccess;
