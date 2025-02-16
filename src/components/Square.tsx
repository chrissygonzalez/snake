const Square = ({ row, cell, value }: { row: number, cell: number, value: string | null }) => {
    let style = "";
    if (value === 'F') style = 'food';
    if (value === 'UP' || value === 'DOWN') style = 'vert-stripes';
    if (value === 'LEFT' || value === 'RIGHT') style = 'horz-stripes';
    return (
        <div
            key={`${row}-${cell}`}
            className={`square ${style}`}>
        </div>
    )
}

export default Square;