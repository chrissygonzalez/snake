import { useState, useEffect, useRef } from 'react';
import { getSnakeArray, getSnakeMap, getNextPosition, initializeBoard } from '../helpers/snakeHelpers';
import songUrl from '../assets/8-bit-music-on-245249.mp3';
import foodSoundUrl from '../assets/gameboy-pluck-41265.mp3'; // From https://pixabay.com
import Board from './Board';
import Message from './Message';
import Controls from './Controls';

const COLUMNS = 40;
const ROWS = 30;
const SNAKE_LENGTH = 6;
const SNAKE_SPEED = 100;
const START_SHOW_FOOD = 30;
const FOOD_SHOW_INTERVAL = 60;
const DELAY = 70;
let snakeDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP';

const SnakeGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoser, setIsLoser] = useState(false);
    const [matrix, setMatrix] = useState<any[][]>(() => initializeBoard(COLUMNS, ROWS, SNAKE_LENGTH));
    const [score, setScore] = useState(SNAKE_LENGTH);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioRef2 = useRef<HTMLAudioElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);

    let foodPosition = [0, 0];
    let foodTick = 0;
    let showFood = false;
    let snakeArr = getSnakeArray(COLUMNS, ROWS, SNAKE_LENGTH);
    let snakeMap = getSnakeMap(snakeArr);

    const isOutOfBounds = (x: number, y: number): boolean => {
        if (x < 0 || y < 0) return true;
        if (x >= COLUMNS || y >= ROWS) return true;
        return false;
    }

    const isSnake = (x: number, y: number): boolean => {
        return snakeMap.has(`${x}-${y}`);
    }

    const isFood = (x: number, y: number): boolean => {
        return x === foodPosition[0] && y === foodPosition[1];
    }

    const updateFoodPosition = () => {
        if (foodTick >= START_SHOW_FOOD + FOOD_SHOW_INTERVAL) {
            foodTick = 0;
        }
        if (foodTick === START_SHOW_FOOD) {
            showFood = true;
            let randomX = -1;
            let randomY = -1;

            // keep trying until a suitable spot is found
            while (isOutOfBounds(randomX, randomY) || isSnake(randomX, randomY)) {
                randomX = Math.floor(Math.random() * (COLUMNS - 1));
                randomY = Math.floor(Math.random() * (ROWS - 1));
            }

            foodPosition = [randomX, randomY];
        } else if (foodTick < START_SHOW_FOOD) {
            showFood = false;
        }
        foodTick++;
    }

    const resetFood = () => {
        foodTick = 0;
    }

    const updateSnakePosition = () => {
        const [headX, headY] = snakeArr[0];
        const [newX, newY] = getNextPosition(headX, headY, snakeDirection);
        if (isFood(newX, newY)) {
            growSnake(newX, newY);
            return;
        }
        if (isOutOfBounds(newX, newY) || isSnake(newX, newY)) {
            setIsPlaying(false);
            setIsLoser(true);
            return;
        }
        moveSnake(newX, newY);
    };

    const addAtHead = (x: number, y: number) => {
        snakeArr.unshift([x, y]);
        snakeMap.set(`${x}-${y}`, snakeDirection);
    }

    const deleteTail = () => {
        const [tailX, tailY] = snakeArr.pop() || [];
        snakeMap.delete(`${tailX}-${tailY}`);
    }

    const growSnake = (x: number, y: number) => {
        audioRef2.current?.play();
        addAtHead(x, y);
        resetFood();
        setScore(score => score + 1);
    }

    const moveSnake = (x: number, y: number) => {
        addAtHead(x, y);
        deleteTail();
    }

    const updateMatrix = () => {
        updateSnakePosition();
        updateFoodPosition();
        setMatrix(matrix => {
            let updatedMatrix = [...matrix];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (snakeMap.has(`${i}-${j}`)) {
                        updatedMatrix[i][j] = snakeMap.get(`${i}-${j}`);
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
        setScore(SNAKE_LENGTH);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const resetRef = () => {
            clearTimeout(debounceRef.current), DELAY;
            debounceRef.current = undefined;
        }

        // called recently, restart wait and exit
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(resetRef, DELAY);
            return;
        }

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

        // begin wait
        debounceRef.current = setTimeout(resetRef, DELAY)
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
        <div className="game">
            <img className="title" alt="SNAKE" src="snake.svg"></img>
            <div className="board">
                <Message isPlaying={isPlaying} isLoser={isLoser} />
                <Board matrix={matrix} />
                <Controls isPlaying={isPlaying} isLoser={isLoser} handleResetGame={handleResetGame} score={score} />
                <audio ref={audioRef} loop={true} src={songUrl} typeof='audio/mpeg' />
                <audio ref={audioRef2} src={foodSoundUrl} typeof='audio/mpeg' />
            </div>
        </div>
    )
}

export default SnakeGame;