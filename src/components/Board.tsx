import { useState, useEffect, useRef } from 'react';
import audioUrl from '../assets/test-trimmed.mp3';

const COLUMNS = 35;
const ROWS = 35;
const SNAKE_LENGTH = 6;

const getSnakeStartPosition = () => {
    const midPtX = Math.floor(COLUMNS / 2);
    const midPtY = Math.floor(ROWS / 2);
    return Array.from(Array(SNAKE_LENGTH), (_, index) => [midPtX, midPtY + index]);
}

const getSnakeSet = (snakeArr: number[][]) => {
    return new Set(snakeArr.map(s => `${s[0]}-${s[1]}`));
}

const SNAKE_SPEED = 100;
let snakeDirection = 'UP';

const getNextPosition = (x: number, y: number) => {
    if (snakeDirection === 'UP') {
        return [x, y - 1];
    }
    if (snakeDirection === 'RIGHT') {
        return [x + 1, y];
    }
    if (snakeDirection === 'LEFT') {
        return [x - 1, y];
    }
    if (snakeDirection === 'DOWN') {
        return [x, y + 1];
    }
    return [x, y];
}

const Board = () => {
    let snakeArr = getSnakeStartPosition();
    let snakeSet = getSnakeSet(snakeArr);
    const initializeBoard = () => {
        const board = Array.from(Array(COLUMNS).fill(null),
            (_) => Array(ROWS).fill(null));

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (snakeSet.has(`${i}-${j}`)) {
                    board[i][j] = 'S';
                } else {
                    board[i][j] = null;
                }
            }
        }
        return board;
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoser, setIsLoser] = useState(false);
    const [matrix, setMatrix] = useState<any[][]>(initializeBoard);
    const ref = useRef<HTMLAudioElement | null>(null);

    let food = [0, 0];
    let foodCount = 0;
    let showFood = false;

    const isWall = (x: number, y: number): boolean => {
        if (x < 0 || y < 0) return true;
        if (x >= COLUMNS || y >= ROWS) return true;
        return false;
    }

    const isSnake = (x: number, y: number): boolean => {
        return snakeSet.has(`${x}-${y}`);
    }

    const isFood = (x: number, y: number): boolean => {
        return x === food[0] && y === food[1];
    }

    // TODO: replace magic numbers with constants
    const updateFoodPosition = () => {
        if (foodCount >= 90) {
            foodCount = 0;
        }
        if (foodCount === 30) {
            showFood = true;
            let randomX = -1;
            let randomY = -1;
            while (isWall(randomX, randomY) || isSnake(randomX, randomY)) {
                randomX = Math.floor(Math.random() * (COLUMNS - 1));
                randomY = Math.floor(Math.random() * (ROWS - 1));
            }
            food = [randomX, randomY];
        } else if (foodCount < 30) {
            showFood = false;
        }
        foodCount++;
    }

    const resetFood = () => {
        foodCount = 0;
    }

    const updateSnakePosition = () => {
        const [headX, headY] = snakeArr[0];
        const [newX, newY] = getNextPosition(headX, headY);
        if (isFood(newX, newY)) {
            growSnake(newX, newY);
            return;
        }
        if (isWall(newX, newY) || isSnake(newX, newY)) {
            setIsPlaying(false);
            setIsLoser(true);
            return;
        }
        moveSnake(newX, newY);
    };

    // TODO: adjust to allow snake to grow more than 1 square at a time
    const growSnake = (x: number, y: number) => {
        snakeArr.unshift([x, y]);
        snakeSet.add(`${x}-${y}`);
        resetFood();
    }

    const moveSnake = (x: number, y: number) => {
        snakeArr.unshift([x, y]);
        const [tailX, tailY] = snakeArr.pop() || [];
        snakeSet.delete(`${tailX}-${tailY}`);
        snakeSet.add(`${x}-${y}`);
    }

    const updateMatrix = () => {
        updateSnakePosition();
        updateFoodPosition();
        setMatrix(matrix => {
            let updatedMatrix = [...matrix];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (snakeSet.has(`${i}-${j}`)) {
                        updatedMatrix[i][j] = 'S';
                    } else if (showFood && isFood(i, j)) {
                        updatedMatrix[i][j] = 'F';
                    } else {
                        updatedMatrix[i][j] = null;
                    }
                }
            }
            return updatedMatrix;
        });
    };

    const handleResetGame = () => {
        setIsLoser(false);
        setMatrix(initializeBoard);
    }

    // TODO: debounce so you can't die as easily?
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isPlaying) {
            setIsPlaying(true);
        }
        if (snakeDirection !== 'UP' && snakeDirection !== 'DOWN') {
            if (e.key === "ArrowUp") snakeDirection = 'UP';
            if (e.key === "ArrowDown") snakeDirection = 'DOWN';
        }
        if (snakeDirection !== 'LEFT' && snakeDirection !== 'RIGHT') {
            if (e.key === "ArrowLeft") snakeDirection = 'LEFT';
            if (e.key === "ArrowRight") snakeDirection = 'RIGHT';
        }
    }

    useEffect(() => {
        let timer = 0;
        if (isPlaying) {
            ref.current?.play();
            timer = setInterval(updateMatrix, SNAKE_SPEED);
        } else {
            ref.current?.pause();
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        if (isLoser) document.removeEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLoser]);

    return (
        <div className="container">
            {isLoser && !isPlaying && <div className="message-lose"><p>You lose!</p></div>}
            <div className="board">
                {matrix.map((row, rowIndex) =>
                    <div key={rowIndex} className="row">
                        {row.map((square: string, squareIndex: number) =>
                            <div
                                key={`${rowIndex}-${squareIndex}`}
                                className={['square', square === 'S' && 'snake', square === 'F' && 'food'].filter(Boolean).join(" ")}>
                            </div>
                        )}
                    </div>)}
            </div>
            <audio ref={ref} loop={true} src={audioUrl} typeof='audio/mpeg' />
            {isLoser && !isPlaying ? <button onClick={handleResetGame}>Reset</button> : <p>Hit any key to start</p>}
        </div>
    )
}

export default Board;