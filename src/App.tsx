import Board from './components/Board'
import './App.css'

const WIDTH = 35;
const HEIGHT = 35;
const SNAKE_LENGTH = 6;

const initializeBoard = (): [any[][], number[][], Set<string>] => {
  // console.log("calling init");
  const grid = Array.from(Array(WIDTH).fill(null),
    (_) => Array(HEIGHT).fill(null));
  const midPtX = Math.floor(WIDTH / 2);
  const midPtY = Math.floor(HEIGHT / 2);
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
  return [grid, snakeSquares, snakeSet];
}

function App() {
  const [initMatrix, initSnakeArr, initSnakeSet] = initializeBoard();

  return (
    <div><Board initMatrix={initMatrix} initSnakeArr={initSnakeArr} initSnakeSet={initSnakeSet} /></div>
  )
}

export default App
