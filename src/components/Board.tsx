import { useState, useEffect } from 'react';

const Board = ({ width = 15, height = 15 }) => {
    const [matrix, setMatrix] = useState<any[]>([]);
    const [snake, setSnake] = useState([3, 4]);

    const drawSnake = () => {
        let [x, y] = snake;
        let updatedMatrix = [...matrix];
        updatedMatrix[x][y] = 'E';
        updatedMatrix[x + 1][y] = 'S'
        setSnake([x + 1, y]);
        setMatrix(updatedMatrix);
    }

    useEffect(() => {
        const filled = Array.from(Array(width).fill(null),
            (_) => Array(height).fill('E'));
        let [x, y] = snake;
        filled[x][y] = "S";
        setMatrix(filled);
    }, []);

    return (
        <>
            <button onClick={drawSnake}>Move</button>
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