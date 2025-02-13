export const getSnakeStartPosition = (cols: number, rows: number, length: number) => {
    const midPtX = Math.floor(cols / 2);
    const midPtY = Math.floor(rows / 2);
    return Array.from(Array(length), (_, index) => [midPtX, midPtY + index]);
}

export const getSnakeSet = (snakeArr: number[][]) => {
    return new Set(snakeArr.map(s => `${s[0]}-${s[1]}`));
}

export const getNextPosition = (x: number, y: number, direction: string) => {
    switch (direction) {
        case 'UP': {
            return [x, y - 1];
        }
        case 'RIGHT': {
            return [x + 1, y];
        }
        case 'LEFT': {
            return [x - 1, y];
        }
        case 'DOWN': {
            return [x, y + 1];
        }
        default: {
            return [x, y];
        }
    }
}

export const initializeBoard = (cols: number, rows: number, length: number) => {
    let snakeArr = getSnakeStartPosition(cols, rows, length);
    let snakeSet = getSnakeSet(snakeArr);

    const board = Array.from(Array(cols).fill(null),
        (_) => Array(rows).fill(null));

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (snakeSet.has(`${i}-${j}`)) {
                board[i][j] = 'S';
            } else {
                board[i][j] = null;
            }
        }
    }
    return board;
}