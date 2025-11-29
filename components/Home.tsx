import React, { useState } from 'react';
import { Button } from './Button';
import { GameMode, PlayerSymbol, PlayerNames } from '../types';

interface HomeProps {
  onStartGame: (mode: GameMode, side: PlayerSymbol, names: PlayerNames) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');
  const [selectedSide, setSelectedSide] = useState<PlayerSymbol>('X');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStart = () => {
      const p1 = player1Name.trim() || 'Player 1';
      const p2 = selectedMode === 'pvai' ? 'Bot' : (player2Name.trim() || 'Player 2');
      
      let names: PlayerNames;

      // Map names to X and O based on choice
      if (selectedSide === 'X') {
          names = { x: p1, o: p2 };
      } else {
          names = { x: p2, o: p1 };
      }

      onStartGame(selectedMode, selectedSide, names);
  };

  const getMatchupText = () => {
      const p1 = player1Name.trim() || 'Player 1';
      const p2 = selectedMode === 'pvai' ? 'Bot' : (player2Name.trim() || 'Player 2');

      if (selectedSide === 'X') {
          return (
              <>
                  <span className="text-pink-600 font-bold">{p1}</span> is <span className="font-black text-pink-500">X</span> (First)
                  <br />
                  <span className="text-rose-400 font-bold">{p2}</span> is <span className="font-black text-rose-300">O</span>
              </>
          );
      } else {
          return (
              <>
                  <span className="text-pink-600 font-bold">{p2}</span> is <span className="font-black text-pink-500">X</span> (First)
                  <br />
                  <span className="text-rose-400 font-bold">{p1}</span> is <span className="font-black text-rose-300">O</span>
              </>
          );
      }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md gap-5 p-6 z-10 overflow-y-auto max-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 tracking-tight drop-shadow-sm">
          Tic Tac Toe
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">Customize your game</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          onClick={() => setSelectedMode('pvp')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2
            ${selectedMode === 'pvp' 
              ? 'border-pink-400 bg-pink-50 text-pink-600 shadow-md shadow-pink-100' 
              : 'border-white bg-white/50 text-slate-400 hover:border-pink-200 hover:bg-white'}
          `}
        >
          <div className="text-3xl">👥</div>
          <span className="font-bold text-sm">PvP</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Human vs Human</span>
        </button>

        <button
          onClick={() => setSelectedMode('pvai')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2
            ${selectedMode === 'pvai' 
              ? 'border-pink-400 bg-pink-50 text-pink-600 shadow-md shadow-pink-100' 
              : 'border-white bg-white/50 text-slate-400 hover:border-pink-200 hover:bg-white'}
          `}
        >
          <div className="text-3xl">🤖</div>
          <span className="font-bold text-sm">PvAI</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Human vs Bot</span>
        </button>
      </div>

      {/* Name Inputs */}
      <div className="w-full space-y-3 bg-white/40 p-4 rounded-2xl border border-white">
          <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  {selectedMode === 'pvp' ? 'Player 1 Name' : 'Your Name'}
              </label>
              <input 
                type="text" 
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder={selectedMode === 'pvp' ? "Player 1" : "You"}
                className="w-full px-4 py-2 rounded-xl border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-600 placeholder:text-slate-300 text-sm"
              />
          </div>
          
          {selectedMode === 'pvp' && (
             <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Player 2 Name</label>
                <input 
                    type="text" 
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Player 2"
                    className="w-full px-4 py-2 rounded-xl border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-600 placeholder:text-slate-300 text-sm"
                />
            </div>
          )}
      </div>

      {/* Side Selection */}
      <div className="w-full bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-white shadow-sm">
        <p className="text-center text-slate-500 font-bold text-sm uppercase tracking-wider mb-4">
            {selectedMode === 'pvp' ? `${player1Name || 'Player 1'}, choose side` : "Choose your side"}
        </p>
        <div className="flex gap-4 justify-center mb-4">
            <button
                onClick={() => setSelectedSide('X')}
                className={`
                    w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300
                    ${selectedSide === 'X'
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110'
                        : 'bg-white text-pink-300 border border-pink-100 hover:border-pink-300'}
                `}
            >
                X
            </button>
            <button
                onClick={() => setSelectedSide('O')}
                className={`
                    w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300
                    ${selectedSide === 'O'
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110'
                        : 'bg-white text-rose-300 border border-pink-100 hover:border-pink-300'}
                `}
            >
                O
            </button>
        </div>
        
        <div className="text-center text-xs text-slate-500 bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
           {getMatchupText()}
        </div>
      </div>

      <Button onClick={handleStart} className="w-full text-lg py-4 shadow-xl shadow-pink-200/50">
        Start Game
      </Button>
    </div>
  );
};