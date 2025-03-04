import Square from './Square';

const Board = ({ boardState }: { boardState: any[][] }) => {
    return (
        <div className="board__grid">
            {boardState.map((row, rowIndex) =>
                <div key={rowIndex} className="board__row">
                    {row.map((value: string, cellIndex: number) =>
                        <Square
                            key={`${rowIndex}-${cellIndex}`}
                            row={rowIndex}
                            cell={cellIndex}
                            value={value} />
                    )}
                </div>)}
        </div>
    )
}

export default Board;