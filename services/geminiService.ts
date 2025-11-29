import { GoogleGenAI, Type } from "@google/genai";
import { BoardState, PlayerSymbol } from "../types";

// Initialize the Gemini AI client
// Note: process.env.API_KEY is expected to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIMove = async (board: BoardState, aiPlayer: PlayerSymbol): Promise<number> => {
  try {
    // 1. Convert board to a readable string format for the AI
    const boardStr = board.map((cell, idx) => cell ? cell : idx).join(',');

    // 2. Define the schema for the AI response to ensure strict JSON output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        bestMoveIndex: {
          type: Type.INTEGER,
          description: "The index (0-8) of the best move to make.",
        },
        reasoning: {
            type: Type.STRING,
            description: "Short reasoning for the move."
        }
      },
      required: ["bestMoveIndex"],
    };

    const opponent = aiPlayer === 'X' ? 'O' : 'X';

    // 3. Construct the prompt
    const prompt = `
      You are an expert Tic-Tac-Toe player. You are playing as '${aiPlayer}'.
      The current board state is represented by this array (0-8): [${boardStr}].
      '${opponent}' is the opponent, '${aiPlayer}' is you. Numbers represent empty slots.
      
      Analyze the board.
      1. If you can win immediately, take that move.
      2. If the opponent ('${opponent}') can win on their next move, you MUST block them.
      3. Otherwise, prioritize the center, then corners, then sides.
      
      Return ONLY the JSON object with the 'bestMoveIndex'.
    `;

    // 4. Call the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for deterministic/strategic play
      },
    });

    // 5. Parse the response
    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const result = JSON.parse(jsonText);
    const moveIndex = result.bestMoveIndex;

    // Validate the move
    if (moveIndex >= 0 && moveIndex <= 8 && board[moveIndex] === null) {
      return moveIndex;
    } else {
        // Fallback: Find first empty slot if AI hallucinates an invalid index
        console.warn("AI suggested invalid move:", moveIndex);
        const firstEmpty = board.findIndex(cell => cell === null);
        return firstEmpty;
    }

  } catch (error) {
    console.error("Error getting AI move:", error);
    // Return -1 to signal failure, caller should handle fallback (e.g., random move)
    return -1;
  }
};