import { useState } from 'react'
import Board from './components/Board'
import './App.css'

const width = 35;
const height = 35;

const initializeBoard = (width: number, height: number): [any[][], number[][], Set<string>] => {
  console.log("calling init");
  const grid = Array.from(Array(width).fill(null),
    (_) => Array(height).fill(null));
  const midPtX = Math.floor(width / 2);
  const midPtY = Math.floor(height / 2);
  const snakeSquares = [[midPtX, midPtY], [midPtX, midPtY + 1], [midPtX, midPtY + 2], [midPtX, midPtY + 3]];
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
  const [initMatrix, initSnakeArr, initSnakeSet] = initializeBoard(width, height);

  return (
    <div><Board initMatrix={initMatrix} initSnakeArr={initSnakeArr} initSnakeSet={initSnakeSet} /></div>
  )
}

export default App
