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

    const getFoodPosition = () => {
        // TODO: randomize foodCount and make longer
        // maybe add a gap when food is not showing
        if (foodCount >= 30) {
            foodCount = 0;
            let randomX = -1;
            let randomY = -1;
            while (isWall(randomX, randomY) || isSnake(randomX, randomY)) {
                randomX = Math.floor(Math.random() * (COL_LENGTH - 1));
                randomY = Math.floor(Math.random() * (ROW_LENGTH - 1));
            }
            food = [randomX, randomY];
        } else {
            foodCount++;
        }
    }

    const updateSnakePosition = () => {
        // console.log("updating snake position");
        // let updatedSnake: number[][] = [...snakeArr];
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
    }

    const moveSnake = (x: number, y: number) => {
        snakeArr.unshift([x, y]);
        const [tailX, tailY] = snakeArr.pop() || [];
        snakeSet.delete(`${tailX}-${tailY}`);
        snakeSet.add(`${x}-${y}`);
    }

    const updateMatrix = () => {
        // console.log("updating matrix");
        updateSnakePosition();
        getFoodPosition();
        setMatrix(matrix => {
            let updatedMatrix = [...matrix];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (snakeSet.has(`${i}-${j}`)) {
                        updatedMatrix[i][j] = 'S';
                    } else if (isFood(i, j)) {
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
        // console.log(e.key);
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

    // const getSquareClass = (content: string) => {
    //     if (content === 'S') return 'snake';
    //     if (content === 'F') return 'food';
    //     return 'square';
    // }

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