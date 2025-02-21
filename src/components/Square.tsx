const Square = ({ row, cell, value }: { row: number, cell: number, value: string | null }) => {
    let style = "";
    if (value && value !== 'F') {
        style = 'snake';
    }
    // if (value === 'UP' || value === 'DOWN') style = 'vert-stripes';
    // if (value === 'LEFT' || value === 'RIGHT') style = 'horz-stripes';
    return (
        <div
            key={`${row}-${cell}`}
            className={`board__square ${style}`}>
            {value === 'F' && <div className="board__square food"></div>}
        </div>
    )
}

export default Square;