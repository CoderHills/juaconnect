// src/artisan/pages/Verification.jsx
import React, { useState, useEffect } from "react";
import "../artisan.css";

const Verification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(
          `http://localhost:5000/api/artisan/${artisanId}/verification`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch verification status`);
        }

        const data = await response.json();
        setVerificationStatus(data);
      } catch (error) {
        console.error("Error fetching verification:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

  if (loading) {
    return (
      <div className="verification-page">
        <header className="page-header">
          <h1 className="page-title">Verification</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading verification status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <header className="page-header">
        <h1 className="page-title">Verification</h1>
      </header>
      <div className="page-content">
        {verificationStatus ? (
          <div className="verification-container">
            <div
              className={`verification-status-card ${
                verificationStatus.isVerified ? "verified" : "not-verified"
              }`}
            >
              <div className="status-icon">
                {verificationStatus.isVerified ? "✅" : "⏳"}
              </div>
              <div className="status-content">
                <h3 className="status-title">
                  {verificationStatus.isVerified
                    ? "Verified Artisan"
                    : "Verification in Progress"}
                </h3>
                <p className="status-description">
                  {verificationStatus.isVerified
                    ? "Your account is fully verified."
                    : "Complete your verification to build trust with clients."}
                </p>
              </div>
              <div className="verification-badge">
                <span className="badge-level">
                  {verificationStatus.level} Level
                </span>
              </div>
            </div>

            <div className="verification-progress">
              <div className="progress-header">
                <h4>Verification Progress</h4>
                <span className="progress-percentage">
                  {verificationStatus.progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${verificationStatus.progress}%` }}
                ></div>
              </div>
            </div>

            {verificationStatus.pendingDocuments &&
              verificationStatus.pendingDocuments.length > 0 && (
                <div className="documents-section">
                  <div className="documents-column">
                    <h4 className="column-title">Required Documents</h4>
                    <div className="documents-list">
                      {verificationStatus.pendingDocuments.map((doc, index) => (
                        <div key={index} className="document-item">
                          <span className="doc-name">{doc}</span>
                          <button className="upload-btn">Upload</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            <div className="verification-actions">
              <button className="primary-btn">Continue Verification</button>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>No verification information found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;