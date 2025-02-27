import { useState } from 'react';
import { getSnakeArray, getSnakeMap, getNextPosition, initializeBoard } from '../helpers/snakeHelpers';

const START_SHOW_FOOD = 30;
const FOOD_SHOW_INTERVAL = 60;

const useGameLogic = ({ columns = 40, rows = 30, snakeLength = 6 } = {}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoser, setIsLoser] = useState(false);
    const [matrix, setMatrix] = useState<any[][]>(() => initializeBoard(columns, rows, snakeLength));
    const [score, setScore] = useState(snakeLength);

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
        // audioRef2.current?.play();
        addAtHead(x, y);
        resetFood();
        setScore(score => score + 1);
    }

    const moveSnake = (x: number, y: number) => {
        addAtHead(x, y);
        deleteTail();
    }

    return {
        isPlaying,
        setIsPlaying,
        isLoser,
        setIsLoser,
        matrix,
        setMatrix,
        score,
        setScore,
        updateSnakePosition,
        updateFoodPosition,
        snakeMap,
        showFood,
        isFood
    }
}

export default useGameLogic;