import { useState, useEffect, useCallback } from 'react';

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
    const [isPlaying, setIsPlaying] = useState(false);
    const [matrix, setMatrix] = useState<any[]>(initMatrix);
    let snakeArr = initSnakeArr;
    let snakeSet = initSnakeSet;

    const updateSnakePosition = () => {
        // console.log("updating snake position");
        let updatedSnake: number[][] = [...snakeArr];
        const [headX, headY] = updatedSnake[0];
        const [newX, newY] = getNextPosition(headX, headY);
        updatedSnake.unshift([newX, newY]);
        const [tailX, tailY] = updatedSnake.pop() || [];
        snakeArr = updatedSnake;

        let updatedSnakeSet = new Set([...snakeSet]);
        updatedSnakeSet.delete(`${tailX}-${tailY}`);
        updatedSnakeSet.add(`${newX}-${newY}`);
        snakeSet = updatedSnakeSet;
    };

    const updateMatrix = () => {
        // console.log("updating matrix");
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

    const handleKeyDown = (e: KeyboardEvent) => {
        // console.log(e.key);
        if (e.key === "ArrowUp") {
            if (snakeDirection !== 'UP' && snakeDirection !== 'DOWN') snakeDirection = 'UP';
        }
        if (e.key === "ArrowDown") {
            if (snakeDirection !== 'UP' && snakeDirection !== 'DOWN') snakeDirection = 'DOWN';
        }
        if (e.key === "ArrowLeft") {
            if (snakeDirection !== 'LEFT' && snakeDirection !== 'RIGHT') snakeDirection = 'LEFT';
        }
        if (e.key === "ArrowRight") {
            if (snakeDirection !== 'LEFT' && snakeDirection !== 'RIGHT') snakeDirection = 'RIGHT';
        }
    }

    useEffect(() => {
        let timer = 0;
        if (isPlaying) {
            timer = setInterval(updateMatrix, 1000);
        }

        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <div>
                <button onClick={() => setIsPlaying(true)}>Start game</button>
                <button onClick={() => setIsPlaying(false)}>Stop game</button>
            </div>
            <div className="board">
                {matrix.map((row, rowIndex) =>
                    <div key={rowIndex} className="row">
                        {row.map((square: string, squareIndex: number) =>
                            <div key={`${rowIndex}-${squareIndex}`} className={square === 'S' ? "snake" : 'square'}>{square}</div>
                        )}
                    </div>)}
            </div>
        </>
    )
}

export default Board;