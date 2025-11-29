import React from 'react';
import { Square } from './Square';
import { BoardState } from '../types';

interface BoardProps {
  board: BoardState;
  onClick: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, onClick, winningLine, disabled }) => {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-pink-100/50 border border-white">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {board.map((square, i) => (
          <Square
            key={i}
            value={square}
            onClick={() => onClick(i)}
            isWinningSquare={winningLine?.includes(i) ?? false}
            disabled={disabled || square !== null}
          />
        ))}
      </div>
    </div>
  );
};