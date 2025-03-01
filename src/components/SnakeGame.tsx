import { useEffect, useRef, useCallback } from 'react';
import songUrl from '../assets/8-bit-music-on-245249.mp3';
import foodSoundUrl from '../assets/gameboy-pluck-41265.mp3'; // From https://pixabay.com
import useGameLogic from '../hooks/useGameLogic';
import { Direction, GameStates } from '../helpers/types';
import Board from './Board';
import Message from './Message';
import Controls from './Controls';

const SNAKE_SPEED = 100;
const DELAY = 100;

const SnakeGame = () => {
    const {
        matrix,
        score,
        snakeDirection,
        changeDirection,
        gameState,
        updateBoard,
        startGame,
        pauseGame,
        handleResetGame
    } = useGameLogic();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioRef2 = useRef<HTMLAudioElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const resetRef = () => {
            clearTimeout(debounceRef.current), DELAY;
            debounceRef.current = undefined;
        }
        // called recently, restart wait and exit
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(resetRef, DELAY);
            return;
        }

        if (gameState === GameStates.ENDED) {
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
                changeDirection(Direction.UP);
                break;
            case 'ArrowDown':
                changeDirection(Direction.DOWN);
                break;
            case 'ArrowLeft':
                changeDirection(Direction.LEFT);
                break;
            case 'ArrowRight':
                changeDirection(Direction.RIGHT);
                break;
            case ' ':
                if (gameState === GameStates.INITIAL || gameState === GameStates.PAUSED) {
                    startGame();
                } else {
                    pauseGame();
                }
                break;
            default:
                break;
        }

        // begin wait
        debounceRef.current = setTimeout(resetRef, DELAY)
    }, [snakeDirection, gameState])


    useEffect(() => {
        let timer = 0;
        if (gameState === GameStates.RUNNING) {
            audioRef.current?.play();
            timer = setInterval(updateBoard, SNAKE_SPEED);
        } else {
            audioRef.current?.pause();
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        if (gameState === GameStates.ENDED) document.removeEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <div className="game">
            <img className="title" alt="SNAKE" src="snake.svg"></img>
            <div className="board">
                <Message gameState={gameState} />
                <Board matrix={matrix} />
                <Controls gameState={gameState} handleResetGame={handleResetGame} score={score} />
                <audio ref={audioRef} loop={true} src={songUrl} typeof='audio/mpeg' />
                <audio ref={audioRef2} src={foodSoundUrl} typeof='audio/mpeg' />
            </div>
        </div>
    )
}

export default SnakeGame;