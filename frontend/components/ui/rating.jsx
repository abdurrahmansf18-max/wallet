import React, { useState, useEffect } from "react";
import { Star, StarHalf } from 'lucide-react';

export function Rating({ initialRating, onChange, readonly, quiet, emptySymbol, fullSymbol, placeholderSymbol, direction }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  // Use useEffect to handle prop changes without triggering the deprecated UNSAFE_componentWillReceiveProps lifecycle method
  useEffect(() => {
    if (initialRating !== undefined && initialRating !== rating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  const handleRatingChange = (newRating) => {
    if (!readonly) {
      setRating(newRating);
      onChange && onChange(newRating);
    }
  };

  const renderStar = (starNumber) => {
    const isHalfStar = (starNumber - 0.5 === Math.floor(hoverRating || rating));
    const isFilled = (starNumber <= (hoverRating || rating));

    return (
      <div
        key={starNumber}
        className="relative w-6 h-6 cursor-pointer"
        onClick={() => handleRatingChange(starNumber)}
        onMouseEnter={() => setHoverRating(starNumber)}
        onMouseLeave={() => setHoverRating(0)}
      >
        <Star
          className={`absolute w-6 h-6 ${isFilled ? "text-yellow-400" : "text-gray-400"}`}
        />
        {isHalfStar && (
          <StarHalf
            className="absolute w-6 h-6 text-yellow-400 fill-current"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${direction === "rtl" ? "flex-row-reverse" : "flex-row"}`}>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
}
