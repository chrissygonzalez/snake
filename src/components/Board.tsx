import { useState, useEffect, useCallback } from 'react';

const initializeBoard = (width: number, height: number): [any[][], number[][], string[]] => {
    const grid = Array.from(Array(width).fill(null),
        (_) => Array(height).fill(null));

    const midPtX = Math.floor(width / 2);
    const midPtY = Math.floor(height / 2);
    const snakeSquares = [[midPtX, midPtY], [midPtX, midPtY + 1], [midPtX, midPtY + 2], [midPtX, midPtY + 3]];
    const snakeStrings = [`${midPtX}-${midPtY}`, `${midPtX}-${midPtY + 1}`, `${midPtX}-${midPtY + 2}`, `${midPtX}-${midPtY + 3}`];
    return [grid, snakeSquares, snakeStrings];
}

const getNextPosition = (x: number, y: number, direction: string) => {
    if (direction === 'UP') {
        return [x, y - 1];
    }
    if (direction === 'RIGHT') {
        return [x + 1, y];
    }
    if (direction === 'LEFT') {
        return [x - 1, y];
    }
    if (direction === 'DOWN') {
        return [x, y + 1];
    }
    return [x, y];
}

let snakeDirection = 'UP';

const Board = ({ width = 35, height = 35 }) => {
    const [matrix, setMatrix] = useState<any[]>(initializeBoard(width, height)[0]);

    let snakeArr = initializeBoard(width, height)[1];
    let snakeSet = new Set(initializeBoard(width, height)[2]);

    const getSnakeDirection = () => {
        console.log("getting snake direction", snakeDirection);
        return snakeDirection;
    }

    const updateSnakePosition = () => {
        console.log("updating snake position");
        let updatedSnake: number[][] = [...snakeArr];
        const [headX, headY] = updatedSnake[0];
        const [newX, newY] = getNextPosition(headX, headY, getSnakeDirection());
        updatedSnake.unshift([newX, newY]);
        const [tailX, tailY] = updatedSnake.pop() || [];
        snakeArr = updatedSnake;

        let updatedSnakeSet = new Set([...snakeSet]);
        updatedSnakeSet.delete(`${tailX}-${tailY}`);
        updatedSnakeSet.add(`${newX}-${newY}`);
        snakeSet = updatedSnakeSet;
    };

    const updateMatrix = () => {
        console.log("updating matrix");
        updateSnakePosition();
        setMatrix(matrix => {
            let updatedMatrix = [...matrix];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (snakeSet.has(`${i}-${j}`)) {
                        updatedMatrix[i][j] = 'S';
                    } else {
                        updatedMatrix[i][j] = null;
                    }
                }
            }
            return updatedMatrix;
        });
    };

    let timer;
    const handleStartGame = () => {
        timer = setInterval(updateMatrix, 1000);
    }

    return (
        <>
            <div><button onClick={handleStartGame}>Start game</button></div>
            <button disabled={snakeDirection === 'RIGHT' || snakeDirection === 'LEFT'} onClick={() => snakeDirection = "LEFT"}>Move Left</button>
            <button disabled={snakeDirection === 'DOWN' || snakeDirection === 'UP'} onClick={() => snakeDirection = "UP"}>Move Up</button>
            <button disabled={snakeDirection === 'UP' || snakeDirection === 'DOWN'} onClick={() => snakeDirection = "DOWN"}>Move Down</button>
            <button disabled={snakeDirection === 'LEFT' || snakeDirection === 'RIGHT'} onClick={() => snakeDirection = "RIGHT"}>Move Right</button>
            <div className="board">
                {matrix.map(row =>
                    <div className="row">
                        {row.map((square: String) =>
                            <div className={square === 'S' ? "snake" : 'square'}>{square}</div>
                        )}
                    </div>)}
            </div>
        </>
    )
}

export default Board;