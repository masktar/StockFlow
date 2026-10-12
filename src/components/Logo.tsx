import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  color = 'currentColor',
  strokeWidth = 7.5
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 
        StockFlow Isometric Cube S-Box Icon
        Matching user's logo design:
        Continuous isometric ribbon contour + 2 shipping label dashes
      */}
      <path
        d="M 24 53.5 L 24 67 L 50 82 L 76 67 L 76 37 L 50 52 L 24 37 L 50 22 L 63 29.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Upper shipping label dash */}
      <path
        d="M 38 56 L 47.5 61.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Lower shipping label dash */}
      <path
        d="M 40.5 63.5 L 47.5 67.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
