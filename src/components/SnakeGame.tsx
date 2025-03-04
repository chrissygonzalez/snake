import { useEffect, useRef, useCallback } from 'react';
import songUrl from '../assets/8-bit-music-on-245249.mp3';
import foodSoundUrl from '../assets/gameboy-pluck-41265.mp3'; // From https://pixabay.com
import useGameLogic from '../hooks/useGameLogic';
import { Direction, GameStates } from '../helpers/types';
import Board from './Board';
import Message from './Message';
import Controls from './Controls';

const SnakeGame = () => {
    const {
        boardState,
        score,
        snakeDirection,
        changeDirection,
        gameState,
        startGame,
        pauseGame,
        handleResetGame,
        musicRef
    } = useGameLogic();

    const DELAY = 100;
    const audioRef2 = useRef<HTMLAudioElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const resetDebounce = () => {
            clearTimeout(debounceRef.current), DELAY;
            debounceRef.current = undefined;
        }
        // called recently, restart wait and exit
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(resetDebounce, DELAY);
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
        debounceRef.current = setTimeout(resetDebounce, DELAY)
    }, [snakeDirection, gameState])

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
                <Board boardState={boardState} />
                <audio ref={musicRef} loop={true} src={songUrl} typeof='audio/mpeg' />
                <audio ref={audioRef2} src={foodSoundUrl} typeof='audio/mpeg' />
            </div>
            <Controls gameState={gameState} handleResetGame={handleResetGame} score={score} />
        </div>
    )
}

export default SnakeGame;