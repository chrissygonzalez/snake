import { useState } from 'react';
import Board from './components/Board';
import './App.css';

const COLUMNS = 35;
const ROWS = 35;
const SNAKE_LENGTH = 6;

const initializeBoard = (): { grid: any[][], snakeSquares: number[][], snakeSet: Set<string> } => {
  // console.log("calling init");
  const grid = Array.from(Array(COLUMNS).fill(null),
    (_) => Array(ROWS).fill(null));
  const midPtX = Math.floor(COLUMNS / 2);
  const midPtY = Math.floor(ROWS / 2);
  const snakeSquares = Array.from(Array(SNAKE_LENGTH), (_, index) => [midPtX, midPtY + index]);
  const snakeSet = new Set(snakeSquares.map(s => `${s[0]}-${s[1]}`));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (snakeSet.has(`${i}-${j}`)) {
        grid[i][j] = 'S';
      } else {
        grid[i][j] = null;
      }
    }
  }
  return { grid, snakeSquares, snakeSet };
}

function App() {
  const [initialState] = useState(initializeBoard);
  const { grid, snakeSquares, snakeSet } = initialState;

  return (
    <div>
      <Board initMatrix={grid} initSnakeArr={snakeSquares} initSnakeSet={snakeSet} />
    </div>
  )
}

export default App
