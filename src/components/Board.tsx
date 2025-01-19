import { useState, useEffect } from 'react';

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

const Board = ({ initMatrix, initSnakeArr, initSnakeSet }: { initMatrix: any[][], initSnakeArr: any[], initSnakeSet: Set<string> }) => {
    const ROW_LENGTH = initMatrix.length;
    const COL_LENGTH = initMatrix[0].length;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLose, setIsLose] = useState(false);
    const [matrix, setMatrix] = useState<any[]>(initMatrix);
    let food = [0, 0];
    let foodCount = 0;
    let showFood = false;
    let snakeArr = initSnakeArr;
    let snakeSet = initSnakeSet;

    const isWall = (x: number, y: number): boolean => {
        if (x < 0 || y < 0) return true;
        if (x >= COL_LENGTH || y >= ROW_LENGTH) return true;
        return false;
    }

    const isSnake = (x: number, y: number): boolean => {
        return snakeSet.has(`${x}-${y}`);
    }

    const isFood = (x: number, y: number): boolean => {
        return x === food[0] && y === food[1];
    }

    const updateFoodPosition = () => {
        if (foodCount >= 90) {
            foodCount = 0;
        }
        if (foodCount === 30) {
            showFood = true;
            let randomX = -1;
            let randomY = -1;
            while (isWall(randomX, randomY) || isSnake(randomX, randomY)) {
                randomX = Math.floor(Math.random() * (COL_LENGTH - 1));
                randomY = Math.floor(Math.random() * (ROW_LENGTH - 1));
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
            setIsLose(true);
            return;
        }
        moveSnake(newX, newY);
    };

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

    const handleKeyDown = (e: KeyboardEvent) => {
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
            timer = setInterval(updateMatrix, SNAKE_SPEED);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            {isLose && <div className="game-lost">You lose!</div>}
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
            <div className="buttons">
                <button onClick={() => setIsPlaying(true)}>Start game</button>
                <button onClick={() => setIsPlaying(false)}>Stop game</button>
            </div>
        </>
    )
}

export default Board;