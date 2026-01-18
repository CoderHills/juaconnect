// src/artisan/pages/Reviews.jsx
import React, { useState, useEffect } from "react";
import "../artisan.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(
          `http://localhost:5000/api/artisan/${artisanId}/reviews`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews`);
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <header className="page-header">
          <h1 className="page-title">Reviews</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <header className="page-header">
        <h1 className="page-title">Reviews</h1>
      </header>
      <div className="page-content">
        <div className="reviews-container">
          {reviews.length > 0 ? (
            <>
              <div className="overall-rating-section">
                <div className="rating-card">
                  <div className="rating-score">
                    <span className="score-number">
                      {(
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)}
                    </span>
                    <div className="score-stars">
                      {renderStars(
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                          reviews.length
                      )}
                    </div>
                    <span className="score-text">Average Rating</span>
                    <span className="score-count">
                      {reviews.length} reviews
                    </span>
                  </div>
                </div>
              </div>

              <div className="reviews-section">
                <h3 className="section-title">Recent Reviews</h3>

                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.client_name
                              ? review.client_name.charAt(0)
                              : "C"}
                          </div>
                          <div className="reviewer-details">
                            <span className="reviewer-name">
                              {review.client_name || "Customer"}
                            </span>
                            <span className="review-service">
                              {review.service || ""}
                            </span>
                          </div>
                        </div>
                        <div className="review-meta">
                          {renderStars(review.rating)}
                          <span className="review-date">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="review-content">
                        <p className="review-comment">{review.comment || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="no-data">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
