"use cleint";

import React, { useEffect, useState } from 'react';

const Stars = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const starCount = 100;
        const starsArray = Array.from({ length: starCount }).map((_, index) => {
            const starStyle = {
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 2}s`,
            };
            return <div key={index} className="star" style={starStyle} />;
        });
        setStars(starsArray);
    }, []);

    return <>{stars}</>;
};

export default Stars;