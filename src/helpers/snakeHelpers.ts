import { Direction } from "./types";

export const getSnakeArray = (cols: number, rows: number, length: number) => {
    const midPtX = Math.floor(cols / 2);
    const midPtY = Math.floor(rows / 2);
    return Array.from(Array(length), (_, index) => [midPtX, midPtY + index]);
}

export const getNextPosition = (x: number, y: number, direction: Direction) => {
    switch (direction) {
        case Direction.UP: {
            return [x, y - 1];
        }
        case Direction.RIGHT: {
            return [x + 1, y];
        }
        case Direction.LEFT: {
            return [x - 1, y];
        }
        case Direction.DOWN: {
            return [x, y + 1];
        }
        default: {
            return [x, y];
        }
    }
}

export const initializeBoard = (cols: number, rows: number, length: number) => {
    let snakeArr = getSnakeArray(cols, rows, length);

    const board = Array.from(Array(cols).fill(null),
        (_) => Array(rows).fill(null));

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (snakeArr.some(([snakeX, snakeY]) => i === snakeX && j === snakeY)) {
                board[i][j] = 'UP';
            } else {
                board[i][j] = null;
            }
        }
    }
    return board;
}