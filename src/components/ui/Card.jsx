import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-card text-card-foreground rounded-2xl border border-border shadow-soft ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
