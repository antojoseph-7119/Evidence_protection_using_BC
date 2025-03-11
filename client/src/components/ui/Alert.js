// src/components/ui/Alert.js
import React from 'react';

const Alert = ({ children, className }) => {
  return (
    <div className={`p-4 border rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className }) => {
  return (
    <p className={`text-sm ${className}`}>
      {children}
    </p>
  );
};

export default Alert;
