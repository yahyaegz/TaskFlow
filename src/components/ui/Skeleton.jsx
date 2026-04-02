import React from 'react';

const Skeleton = ({ className, width, height, borderRadius = '0.5rem' }) => {
  return (
    <div 
      className={`animate-pulse bg-muted/50 dark:bg-muted/20 ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '1rem',
        borderRadius
      }}
    />
  );
};

export default Skeleton;
