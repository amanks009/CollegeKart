// Shimmer.js
import React from 'react';
import './Shimmer.css';

const Shimmer = () => {
    return (
        <div className="shimmer-card">
            <div className="shimmer-image"></div>
            <div className="shimmer-content">
                <div className="shimmer-line shimmer-title"></div>
                <div className="shimmer-line shimmer-category"></div>
                <div className="shimmer-line shimmer-price"></div>
                <div className="shimmer-icon"></div>
            </div>
        </div>
    );
}

export default Shimmer;
