import { useState, useEffect } from 'react';

const SNAKE_START_LENGTH = 4;
const SNAKE_START_DIRECTION = 'UP';

const initializeBoard = (width: number, height: number): [any[][], number[][], string[]] => {
    const filled = Array.from(Array(width).fill(null),
        (_) => Array(height).fill(null));

    const midPtX = Math.floor(width / 2);
    const midPtY = Math.floor(height / 2);
    const snakeSquares = [[midPtX, midPtY], [midPtX, midPtY + 1], [midPtX, midPtY + 2], [midPtX, midPtY + 3]];
    const snakeStrings = [`${midPtX}-${midPtY}`, `${midPtX}-${midPtY + 1}`, `${midPtX}-${midPtY + 2}`, `${midPtX}-${midPtY + 3}`];
    return [filled, snakeSquares, snakeStrings];
}

const Board = ({ width = 15, height = 15 }) => {
    const [filled, snakeSquares, snakeStrings] = initializeBoard(width, height);
    const [matrix, setMatrix] = useState<any[]>(filled);
    const [snakeArr, setSnakeArr] = useState(snakeSquares);
    const [snakeSet, setSnakeSet] = useState(new Set([...snakeStrings]));

    const moveSnake = () => {
        let updatedSnake: number[][] = [...snakeArr];
        const [headX, headY] = updatedSnake[0];
        const newHead = [headX, headY - 1]
        updatedSnake.unshift(newHead);
        const [tailX, tailY] = updatedSnake.pop() || [];
        setSnakeArr(updatedSnake);

        let updatedSnakeSet = new Set([...snakeSet]);
        updatedSnakeSet.delete(`${tailX}-${tailY}`);
        updatedSnakeSet.add(`${newHead[0]}-${newHead[1]}`);
        setSnakeSet(new Set(updatedSnakeSet));
    }

    const drawSnake = () => {
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
        setMatrix(updatedMatrix);
    }

    useEffect(() => {
        drawSnake();
    }, [snakeSet]);

    return (
        <>
            <button onClick={moveSnake}>Move</button>
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