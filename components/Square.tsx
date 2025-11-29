import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

export const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  return (
    <button
      className={`
        relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl text-5xl flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${disabled ? 'cursor-default' : 'cursor-pointer hover:bg-pink-50 hover:-translate-y-1 active:translate-y-0'}
        ${isWinningSquare 
            ? 'bg-pink-200 text-white shadow-inner ring-4 ring-pink-100 border-transparent' 
            : 'bg-white border-2 border-pink-100 shadow-sm text-gray-700'}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`
        transform transition-all duration-500
        ${value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        ${value === 'X' ? 'text-pink-500' : 'text-rose-300'}
        ${isWinningSquare ? 'text-white' : ''}
        drop-shadow-sm
      `}>
        {value === 'X' && (
             <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-[3] stroke-cap-round">
                 <path d="M18 6L6 18M6 6l12 12" />
             </svg>
        )}
        {value === 'O' && (
             <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-[3]">
                 <circle cx="12" cy="12" r="9" />
             </svg>
        )}
      </span>
    </button>
  );
};