import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { Button } from './components/Button';
import { WinnerModal } from './components/WinnerModal';
import { Home } from './components/Home';
import { getAIMove } from './services/geminiService';
import { Player, PlayerSymbol, BoardState, GameMode, GameStatus, PlayerNames } from './types';
import { WINNING_COMBINATIONS } from './constants';
import { Toaster, toast } from 'react-hot-toast';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

export default function App() {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState<boolean>(true); // X always starts in Tic-Tac-Toe
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player>(null); // Explicitly track winner
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState(false);
  
  // Names
  const [playerNames, setPlayerNames] = useState<PlayerNames>({ x: 'Player X', o: 'Player O' });

  // Track which side the human is currently playing
  const [humanSide, setHumanSide] = useState<PlayerSymbol>('X');

  const currentPlayer = isXNext ? 'X' : 'O';

  // Determine who the AI is
  const aiSymbol = gameMode === 'pvai' ? (humanSide === 'X' ? 'O' : 'X') : null;

  const checkWinner = useCallback((currentBoard: BoardState) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: [a, b, c] };
      }
    }
    return null;
  }, []);

  const handleSquareClick = useCallback((index: number) => {
    if (board[index] || gameStatus !== 'playing' || isThinking) return;
    
    // Prevent user from clicking during AI turn in PvAI mode
    if (gameMode === 'pvai' && currentPlayer === aiSymbol) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const winResult = checkWinner(newBoard);
    
    if (winResult) {
      setGameStatus('won');
      setWinner(winResult.winner as Player);
      setWinningLine(winResult.line);
      updateScore(winResult.winner as Player);
    } else if (!newBoard.includes(null)) {
      setGameStatus('draw');
      setWinner(null);
      updateScore(null);
    } else {
      setIsXNext(!isXNext);
    }
  }, [board, gameStatus, isXNext, currentPlayer, checkWinner, isThinking, gameMode, aiSymbol]);

  const updateScore = (winner: Player | null) => {
    setScores(prev => ({
      ...prev,
      x: winner === 'X' ? prev.x + 1 : prev.x,
      o: winner === 'O' ? prev.o + 1 : prev.o,
      draws: winner === null ? prev.draws + 1 : prev.draws
    }));
  };

  const handleStartGame = (mode: GameMode, side: PlayerSymbol, names: PlayerNames) => {
      setGameMode(mode);
      setHumanSide(side);
      setPlayerNames(names);
      setScores({ x: 0, o: 0, draws: 0 });
      resetBoard();
      setView('game');
  };

  const resetBoard = () => {
    setBoard(INITIAL_BOARD);
    setIsXNext(true); // Always reset to X starts
    setGameStatus('playing');
    setWinningLine(null);
    setWinner(null);
  };

  const handlePlayAgain = () => {
      // Swap sides for the next game
      const nextSide = humanSide === 'X' ? 'O' : 'X';
      setHumanSide(nextSide);
      
      // Swap names so the person keeps their name but plays the other symbol
      // If P1 was X (Bob) and P2 was O (Alice). P1 becomes O. 
      // X is now Alice, O is now Bob.
      setPlayerNames(prev => ({ x: prev.o, o: prev.x }));

      resetBoard();
      
      let msg = '';
      if (gameMode === 'pvai') {
        msg = nextSide === 'X' ? 'You play as X (First)' : 'Bot plays as X (First)';
      } else {
        msg = `Swapping sides! ${playerNames.o} is now X.`;
      }
      toast.success(msg);
  };

  const handleGoHome = () => {
      setView('home');
      resetBoard();
  };

  // AI Turn Effect
  useEffect(() => {
    let mounted = true;

    const makeAIMove = async () => {
      if (gameMode === 'pvai' && gameStatus === 'playing' && currentPlayer === aiSymbol) {
        setIsThinking(true);
        try {
          const delay = board.every(c => c === null) ? 1000 : 600;
          
          if (!aiSymbol) return;

          const [index] = await Promise.all([
             getAIMove(board, aiSymbol),
             new Promise(resolve => setTimeout(resolve, delay))
          ]);

          if (!mounted) return;

          if (index !== -1 && board[index] === null) {
            const newBoard = [...board];
            newBoard[index] = aiSymbol;
            setBoard(newBoard);

            const winResult = checkWinner(newBoard);
            if (winResult) {
              setGameStatus('won');
              setWinner(winResult.winner as Player);
              setWinningLine(winResult.line);
              updateScore(aiSymbol);
            } else if (!newBoard.includes(null)) {
              setGameStatus('draw');
              setWinner(null);
              updateScore(null);
            } else {
              setIsXNext(!isXNext);
            }
          }
        } catch (error) {
          console.error("AI Error", error);
          if (mounted) {
            toast.error("Bot got confused! Making a random move.");
             const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter((val): val is number => val !== null);
             if (emptyIndices.length > 0) {
                 const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                 const newBoard = [...board];
                 newBoard[randomIdx] = aiSymbol || 'O';
                 setBoard(newBoard);
                 
                 const winResult = checkWinner(newBoard);
                 if (winResult) {
                   setGameStatus('won');
                   setWinner(winResult.winner as Player);
                   setWinningLine(winResult.line);
                   updateScore(aiSymbol);
                 } else if (!newBoard.includes(null)) {
                    setGameStatus('draw');
                    setWinner(null);
                    updateScore(null);
                 } else {
                    setIsXNext(!isXNext);
                 }
             }
          }
        } finally {
          if (mounted) setIsThinking(false);
        }
      }
    };

    makeAIMove();
    return () => { mounted = false; };
  }, [isXNext, gameMode, gameStatus, board, checkWinner, currentPlayer, aiSymbol]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

        {view === 'home' ? (
            <Home onStartGame={handleStartGame} />
        ) : (
            <div className="z-10 w-full max-w-md flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full flex justify-between items-center px-2">
                    <Button variant="ghost" onClick={handleGoHome} className="!px-2 !py-2">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </Button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-pink-500">Tic Tac Toe</h1>
                        <p className="text-pink-300 text-xs font-bold uppercase tracking-wider">
                            {gameMode === 'pvp' ? 'PvP Mode' : 'PvAI Mode'}
                        </p>
                    </div>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <GameInfo 
                    scores={scores} 
                    currentPlayer={currentPlayer} 
                    isThinking={isThinking}
                    gameStatus={gameStatus}
                    gameMode={gameMode}
                    aiPlayerSymbol={aiSymbol || undefined}
                    playerNames={playerNames}
                />

                <Board 
                    board={board} 
                    onClick={handleSquareClick} 
                    winningLine={winningLine}
                    disabled={gameStatus !== 'playing' || (gameMode === 'pvai' && currentPlayer === aiSymbol)}
                />

                <div className="text-center text-slate-400 text-sm font-medium">
                    <span className="font-bold text-pink-500">{playerNames[currentPlayer === 'X' ? 'x' : 'o']}</span>'s Turn
                </div>
            </div>
        )}

        <WinnerModal 
            isOpen={gameStatus !== 'playing' && view === 'game'} 
            winner={winner}
            winnerName={winner ? playerNames[winner.toLowerCase() as 'x' | 'o'] : undefined}
            onClose={handlePlayAgain}
            onHome={handleGoHome}
            isDraw={gameStatus === 'draw'}
        />
        
        <div className="absolute bottom-4 text-pink-300 text-xs text-center opacity-60">
            Powered by Google Gemini 2.5
        </div>
        <Toaster position="bottom-center" toastOptions={{
             style: {
                background: '#fff',
                color: '#ec4899',
                border: '1px solid #fce7f3',
             },
        }} />
    </div>
  );
}