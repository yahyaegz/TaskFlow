import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-tr from-primary-600 to-indigo-500 text-white hover:shadow-premium-hover hover:brightness-110 focus:ring-primary-500',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-400 border border-slate-200 dark:border-slate-700',
    danger: 'bg-gradient-to-tr from-red-600 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/20 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 focus:ring-primary-500',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { y: -1 }}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
