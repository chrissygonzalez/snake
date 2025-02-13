import { useState, useEffect, useRef } from 'react';
import { getSnakeStartPosition, getSnakeSet, getNextPosition, initializeBoard } from '../helpers/snakeHelpers';
import audioUrl from '../assets/test-trimmed.mp3';

const COLUMNS = 35;
const ROWS = 35;
const SNAKE_LENGTH = 6;
const SNAKE_SPEED = 100;
let snakeDirection = 'UP';

const Board = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoser, setIsLoser] = useState(false);
    const [matrix, setMatrix] = useState<any[][]>(() => initializeBoard(COLUMNS, ROWS, SNAKE_LENGTH));
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);

    let food = [0, 0];
    let foodCount = 0;
    let showFood = false;
    let snakeArr = getSnakeStartPosition(COLUMNS, ROWS, SNAKE_LENGTH);
    let snakeSet = getSnakeSet(snakeArr);

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
        const [newX, newY] = getNextPosition(headX, headY, snakeDirection);
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
        setMatrix(() => initializeBoard(COLUMNS, ROWS, SNAKE_LENGTH));
        snakeDirection = 'UP';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const delay = 60;
        const resetRef = () => {
            clearTimeout(debounceRef.current), delay;
            debounceRef.current = undefined;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(resetRef, delay);
            return;
        }

        debounceRef.current = setTimeout(resetRef, delay)

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
            audioRef.current?.play();
            timer = setInterval(updateMatrix, SNAKE_SPEED);
        } else {
            audioRef.current?.pause();
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
            <audio ref={audioRef} loop={true} src={audioUrl} typeof='audio/mpeg' />
            {isLoser && !isPlaying && <button onClick={handleResetGame}>Reset</button>}
            {!isLoser && !isPlaying && <p>Hit any key to start</p>}
        </div>
    )
}

export default Board;