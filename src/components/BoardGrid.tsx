import Square from './Square';

const BoardGrid = ({ matrix }: { matrix: any[][] }) => {
    return (
        <div className="board">
            {matrix.map((row, rowIndex) =>
                <div key={rowIndex} className="row">
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