import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange = () => {},
  showValue = false,
  totalReviews = null,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const currentDisplay = interactive ? hoverRating || rating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentDisplay;
          const isHalf = !isFilled && starValue - 0.5 <= currentDisplay;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`transition-all duration-200 focus:outline-none ${
                interactive
                  ? 'cursor-pointer hover:scale-125 transform active:scale-100 p-0.5'
                  : 'cursor-default'
              }`}
              title={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : `${rating} stars`}
            >
              <Star
                className={`${sizeClasses[size] || sizeClasses.md} transition-colors duration-200 ${
                  isFilled
                    ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-500'
                    : 'fill-zinc-200 text-zinc-300 dark:fill-zinc-700 dark:text-zinc-600'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="font-semibold text-zinc-900 ml-1 text-sm flex items-center gap-1">
          <span>{Number(rating).toFixed(1)}</span>
          {totalReviews !== null && (
            <span className="text-zinc-500 font-normal text-xs">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRating;
