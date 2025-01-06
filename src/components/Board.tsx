import { useState, useEffect } from 'react';

const Board = ({ width = 10, height = 10 }) => {
    const [matrix, setMatrix] = useState<any[]>([]);

    useEffect(() => {
        const filled = Array.from(Array(height).fill(null),
            (_) => Array(width).fill('E'));
        filled[2][4] = "S";
        setMatrix(filled);
    }, []);
    return (
        <div className="board">
            {matrix.map(row =>
                <div className="row">
                    {row.map((square: String) =>
                        <div className="square">{square}</div>
                    )}
                </div>)}
        </div>
    )
}

export default Board;