export type PlayerSymbol = 'X' | 'O';
export type Player = PlayerSymbol | null;
export type BoardState = Player[];
export type GameMode = 'pvp' | 'pvai';
export type GameStatus = 'playing' | 'won' | 'draw';

export interface Scores {
    x: number;
    o: number;
    draws: number;
}

export interface PlayerNames {
    x: string;
    o: string;
}