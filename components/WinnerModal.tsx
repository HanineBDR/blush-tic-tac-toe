import React from 'react';
import { Button } from './Button';
import { Player } from '../types';

interface WinnerModalProps {
  isOpen: boolean;
  winner: Player | null;
  winnerName?: string;
  isDraw: boolean;
  onClose: () => void;
  onHome: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, winner, winnerName, isDraw, onClose, onHome }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-pink-200 border border-pink-100 text-center transform animate-in zoom-in-95 duration-300">
        
        <div className="mb-6">
            {isDraw ? (
                <div className="text-6xl mb-4 animate-bounce">🤝</div>
            ) : (
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
            )}
            
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-2">
                {isDraw ? "It's a Draw!" : `${winnerName || winner} Wins!`}
            </h2>
            <p className="text-slate-500 font-medium">
                {isDraw 
                    ? "Great minds think alike." 
                    : `${winnerName || winner} (${winner}) takes the round!`}
            </p>
        </div>

        <div className="flex flex-col gap-3">
            <Button onClick={onClose} className="w-full shadow-lg shadow-pink-200/50">
                Play Again 
                <span className="ml-2 opacity-70 text-xs font-normal">(Swap Sides)</span>
            </Button>
            <Button onClick={onHome} variant="secondary" className="w-full">
                Go Home
            </Button>
        </div>
      </div>
    </div>
  );
};