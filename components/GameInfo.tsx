import React from 'react';
import { Scores, Player, GameStatus, GameMode, PlayerSymbol, PlayerNames } from '../types';

interface GameInfoProps {
  scores: Scores;
  currentPlayer: Player;
  isThinking: boolean;
  gameStatus: GameStatus;
  gameMode: GameMode;
  aiPlayerSymbol?: PlayerSymbol;
  playerNames: PlayerNames;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
    scores, 
    currentPlayer, 
    isThinking, 
    gameStatus,
    gameMode,
    aiPlayerSymbol,
    playerNames
}) => {
  
  const getStatusMessage = () => {
      if (gameStatus !== 'playing') return 'Game Over';
      if (isThinking) return 'Bot is thinking...';
      const name = currentPlayer === 'X' ? playerNames.x : playerNames.o;
      return `${name}'s Turn`;
  };

  return (
    <div className="w-full">
      {/* Score Cards */}
      <div className="flex justify-between gap-4 mb-6">
        <ScoreCard 
            label={playerNames.x} 
            symbol="X"
            score={scores.x} 
            active={currentPlayer === 'X' && !isThinking && gameStatus === 'playing'} 
            isAi={gameMode === 'pvai' && aiPlayerSymbol === 'X'}
        />
        <ScoreCard label="Draws" symbol="" score={scores.draws} />
        <ScoreCard 
            label={playerNames.o} 
            symbol="O"
            score={scores.o} 
            active={currentPlayer === 'O' && !isThinking && gameStatus === 'playing'} 
            isAi={gameMode === 'pvai' && aiPlayerSymbol === 'O'} 
        />
      </div>

      {/* Status Banner */}
      <div className={`
        text-center py-2 px-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300
        ${isThinking ? 'bg-pink-100 text-pink-600 animate-pulse' : 'bg-white text-slate-500'}
        shadow-sm border border-pink-50
      `}>
        {getStatusMessage()}
      </div>
    </div>
  );
};

const ScoreCard = ({ label, symbol, score, active = false, isAi = false }: { label: string, symbol: string, score: number, active?: boolean, isAi?: boolean }) => (
    <div className={`
        flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300
        ${active ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 transform -translate-y-1' : 'bg-white text-slate-600 shadow-sm border border-pink-50'}
        relative overflow-hidden
    `}>
        {isAi && (
             <div className="absolute top-0 right-0 p-1">
                 <svg className="w-3 h-3 text-current opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
             </div>
        )}
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1 flex items-center gap-1 max-w-full truncate px-1">
            {label}
            {isAi && <span className="text-[8px] border border-current px-1 rounded">AI</span>}
        </span>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold leading-none">{score}</span>
            {symbol && <span className="text-xs opacity-50 font-bold">{symbol}</span>}
        </div>
    </div>
);