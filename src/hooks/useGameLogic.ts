import { useState, useEffect, useRef, useCallback } from 'react';
import { getSnakeArray, getNextPosition, initializeBoard } from '../helpers/snakeHelpers';
import { Direction, GameStates } from '../helpers/types';
import { loadFile, playTrack, turnSoundOff, turnSoundOn } from '../helpers/audioHelpers';
import foodSoundUrl from '../assets/gameboy-pluck-41265.mp3'; // From https://pixabay.com
import deathSoundUrl from '../assets/videogame-death-sound-43894.mp3';

const COLUMNS = 40;
const ROWS = 30;
const SNAKE_LENGTH = 6;
const START_SHOW_FOOD = 30;
const FOOD_SHOW_INTERVAL = 60;
const SNAKE_SPEED = 100;
const foodSound = await loadFile(foodSoundUrl);
const deathSound = await loadFile(deathSoundUrl);

const useGameLogic = ({ columns = COLUMNS, rows = ROWS, snakeLength = SNAKE_LENGTH, snakeSpeed = SNAKE_SPEED } = {}) => {
    const [gameState, setGameState] = useState(GameStates.INITIAL);
    const [boardState, setBoardState] = useState<any[][]>(() => initializeBoard(columns, rows, snakeLength));
    const [score, setScore] = useState(snakeLength);
    const [snakeDirection, setSnakeDirection] = useState(Direction.UP);
    const [soundOn, setSoundOn] = useState(true);
    const currDirection = useRef<Direction>(snakeDirection);
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const gameTimer = useRef(0);

    let foodPosition = [0, 0];
    let foodTick = 0;
    let showFood = false;
    let snakeArr = getSnakeArray(columns, rows, snakeLength);

    const isOutOfBounds = (x: number, y: number): boolean => {
        return (x < 0 || y < 0 || x >= columns || y >= rows);
    }

    const isSnake = (x: number, y: number): boolean => {
        return snakeArr.some(([snakeX, snakeY]) => x === snakeX && y === snakeY);
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
            let [randomX, randomY] = foodPosition;
            // keep trying until a suitable spot is found
            while (isOutOfBounds(randomX, randomY) || isSnake(randomX, randomY)) {
                randomX = Math.floor(Math.random() * (columns - 1));
                randomY = Math.floor(Math.random() * (rows - 1));
            }
            foodPosition = [randomX, randomY];
        } else if (foodTick < START_SHOW_FOOD) {
            showFood = false;
            foodPosition = [-1, -1];
        }
        foodTick++;
    }

    const resetFood = () => {
        foodTick = 0;
    }

    const updateSnakePosition = useCallback(() => {
        const [headX, headY] = snakeArr[0];
        const [newX, newY] = getNextPosition(headX, headY, currDirection.current);
        if (isOutOfBounds(newX, newY) || isSnake(newX, newY)) {
            endGame();
            return;
        }
        snakeArr.unshift([newX, newY]);
        if (isFood(newX, newY)) {
            playTrack(foodSound);
            resetFood();
            setScore(score => score + 1);
            return;
        }
        snakeArr.pop();
    }, [soundOn]);

    const updateBoard = useCallback(() => {
        updateSnakePosition();
        updateFoodPosition();
        setBoardState(boardState => {
            let updatedMatrix = [...boardState];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (isSnake(i, j)) {
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

    const endGame = () => {
        setGameState(GameStates.ENDED);
        playTrack(deathSound);
    }

    const handleResetGame = useCallback(() => {
        if (musicRef.current) musicRef.current.currentTime = 0;
        setGameState(GameStates.INITIAL);
        setBoardState(() => initializeBoard(columns, rows, snakeLength));
        setSnakeDirection(Direction.UP);
        currDirection.current = Direction.UP;
        setScore(snakeLength);
        snakeArr = getSnakeArray(columns, rows, snakeLength);
        resetFood();
    }, []);

    // This is the game loop
    useEffect(() => {
        if (gameState === GameStates.INITIAL) {
            if (musicRef.current) musicRef.current.volume = 0.3;
        }
        if (gameState === GameStates.RUNNING) {
            musicRef.current?.play();
            gameTimer.current = setInterval(updateBoard, snakeSpeed);
        } else {
            musicRef.current?.pause();
            clearInterval(gameTimer.current);
        }
        return () => clearInterval(gameTimer.current);
    }, [gameState]);

    useEffect(() => {
        if (!soundOn) {
            turnSoundOff();
            if (musicRef.current) {
                musicRef.current.pause();
            }
        } else {
            turnSoundOn();
            if (musicRef.current && gameState === GameStates.RUNNING) {
                musicRef.current.play();
            }
        }
    }, [soundOn, gameState]);

    return {
        boardState,
        score,
        snakeDirection,
        changeDirection,
        gameState,
        updateBoard,
        startGame,
        pauseGame,
        handleResetGame,
        musicRef,
        soundOn,
        setSoundOn,
    }
}

export default useGameLogic;