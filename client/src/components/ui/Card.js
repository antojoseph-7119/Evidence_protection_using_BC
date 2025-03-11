// src/components/ui/Card.js
import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`p-4 shadow-lg rounded-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
