import Square from './Square';

const BoardGrid = ({ matrix }: { matrix: any[][] }) => {
    return (
        <div className="board__grid">
            {matrix.map((row, rowIndex) =>
                <div key={rowIndex} className="board__row">
                    {row.map((value: string, cellIndex: number) =>
                        <Square
                            key={`${rowIndex}=${cellIndex}`}
                            row={rowIndex}
                            cell={cellIndex}
                            value={value} />
                    )}
                </div>)}
        </div>
    )
}

export default BoardGrid;