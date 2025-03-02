import { useState, useEffect, useRef, useCallback } from 'react';
import { getSnakeArray, getSnakeMap, getNextPosition, initializeBoard } from '../helpers/snakeHelpers';
import { Direction, GameStates } from '../helpers/types';

const COLUMNS = 40;
const ROWS = 30;
const SNAKE_LENGTH = 6;
const START_SHOW_FOOD = 30;
const FOOD_SHOW_INTERVAL = 60;
const SNAKE_SPEED = 100;

const useGameLogic = ({ columns = COLUMNS, rows = ROWS, snakeLength = SNAKE_LENGTH, snakeSpeed = SNAKE_SPEED } = {}) => {
    const [gameState, setGameState] = useState(GameStates.INITIAL);
    const [matrix, setMatrix] = useState<any[][]>(() => initializeBoard(columns, rows, snakeLength));
    const [score, setScore] = useState(snakeLength);
    const [snakeDirection, setSnakeDirection] = useState(Direction.UP);
    const currDirection = useRef<Direction>(snakeDirection);
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const gameTimer = useRef(-1);

    let foodPosition = [0, 0];
    let foodTick = 0;
    let showFood = false;
    let snakeArr = getSnakeArray(columns, rows, snakeLength);
    let snakeMap = getSnakeMap(snakeArr);

    const isOutOfBounds = (x: number, y: number): boolean => {
        if (x < 0 || y < 0) return true;
        if (x >= columns || y >= rows) return true;
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
                randomX = Math.floor(Math.random() * (columns - 1));
                randomY = Math.floor(Math.random() * (rows - 1));
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
        const [newX, newY] = getNextPosition(headX, headY, currDirection.current);
        if (isFood(newX, newY)) {
            growSnake(newX, newY);
            return;
        }
        if (isOutOfBounds(newX, newY) || isSnake(newX, newY)) {
            endGame();
            return;
        }
        moveSnake(newX, newY);
    };

    const addAtHead = (x: number, y: number) => {
        snakeArr.unshift([x, y]);
        snakeMap.set(`${x}-${y}`, currDirection);
    }

    const deleteTail = () => {
        const [tailX, tailY] = snakeArr.pop() || [];
        snakeMap.delete(`${tailX}-${tailY}`);
    }

    const growSnake = (x: number, y: number) => {
        // audioRef2.current?.play();
        addAtHead(x, y);
        resetFood();
        setScore(score => score + 1);
    }

    const moveSnake = (x: number, y: number) => {
        addAtHead(x, y);
        deleteTail();
    }

    const updateBoard = useCallback(() => {
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
    }, []);

    const changeDirection = useCallback((direction: Direction) => {
        if (
            (currDirection.current === Direction.UP && direction === Direction.DOWN) ||
            (currDirection.current === Direction.DOWN && direction === Direction.UP) ||
            (currDirection.current === Direction.LEFT && direction === Direction.RIGHT) ||
            (currDirection.current === Direction.RIGHT && direction === Direction.LEFT)
        ) {
            return;
        }
        setSnakeDirection(direction);
        currDirection.current = direction;
    }, [])

    const startGame = () => setGameState(GameStates.RUNNING);

    const pauseGame = () => setGameState(GameStates.PAUSED);

    const endGame = () => setGameState(GameStates.ENDED);

    const handleResetGame = useCallback(() => {
        setGameState(GameStates.INITIAL);
        setMatrix(() => initializeBoard(columns, rows, snakeLength));
        setSnakeDirection(Direction.UP);
        currDirection.current = Direction.UP;
        setScore(snakeLength);
        snakeArr = getSnakeArray(columns, rows, snakeLength);
        snakeMap = getSnakeMap(snakeArr);
        resetFood();
    }, []);

    // This is the game loop
    useEffect(() => {
        if (gameState === GameStates.RUNNING) {
            musicRef.current?.play();
            gameTimer.current = setInterval(updateBoard, snakeSpeed);
        } else {
            musicRef.current?.pause();
            clearInterval(gameTimer.current);
        }
        return () => clearInterval(gameTimer.current);
    }, [gameState]);

    return {
        matrix,
        score,
        snakeDirection,
        changeDirection,
        gameState,
        updateBoard,
        startGame,
        pauseGame,
        handleResetGame,
        musicRef
    }
}

export default useGameLogic;