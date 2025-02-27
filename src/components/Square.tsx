const Square = ({ row, cell, value }: { row: number, cell: number, value: string | null }) => {
    return (
        <div
            key={`${row}-${cell}`}
            className={`board__square ${value && value !== 'F' ? 'snake' : ''}`}>
            {value === 'F' && <div className="board__square food"></div>}
        </div>
    )
}

export default Square;