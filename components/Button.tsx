import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-200 focus:ring-pink-400 border border-transparent",
    secondary: "bg-white text-pink-500 border-2 border-pink-100 hover:border-pink-300 hover:bg-pink-50 focus:ring-pink-200",
    ghost: "bg-transparent text-pink-400 hover:text-pink-600 hover:bg-pink-50/50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};