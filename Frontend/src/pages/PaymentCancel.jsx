import React from "react";
import "./PaymentCancel.css";

const PaymentCancel = () => {
  return (
    <div className="cancel-container">
      <div className="cancel-card">
        <div className="cancel-icon-wrapper">
          <svg
            className="cancel-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <h1 className="cancel-title">Payment Cancelled!</h1>
        <p className="cancel-message">
          Something went wrong, please try again.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;
