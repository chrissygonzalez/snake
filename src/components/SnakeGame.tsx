import { useEffect, useRef, useCallback } from 'react';
import songUrl from '../assets/8-bit-music-on-245249.mp3';
import useGameLogic from '../hooks/useGameLogic';
import { Direction, GameStates } from '../helpers/types';
import Board from './Board';
import Message from './Message';
import Controls from './Controls';
import SoundButton from './SoundButton';

const SnakeGame = () => {
    const {
        boardState,
        score,
        changeDirection,
        gameState,
        startGame,
        pauseGame,
        handleResetGame,
        musicRef,
        soundOn,
        setSoundOn
    } = useGameLogic();

    const DELAY = 60;
    const debounceRef = useRef<number | undefined>(undefined);
    const resetDebounce = () => {
        clearTimeout(debounceRef.current);
        debounceRef.current = undefined;
    }

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState === GameStates.ENDED) return;
        // called too recently, restart wait and exit
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(resetDebounce, DELAY);
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
    }, [gameState])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        if (gameState === GameStates.ENDED) document.removeEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <main className="game">
            <div className="titleBar">
                {/* Heading is for screen readers */}
                <h1 className="visuallyHidden">Snake Game</h1>
                <img className="title" alt="SNAKE" src="snake.svg"></img>
                <SoundButton soundOn={soundOn} setSoundOn={setSoundOn} />
            </div>
            <div className="board">
                <Message gameState={gameState} />
                <Board boardState={boardState} />
                <audio ref={musicRef} loop={true} src={songUrl} typeof='audio/mpeg' />
            </div>
            <Controls gameState={gameState} handleResetGame={handleResetGame} score={score} />
        </main>
    )
}

export default SnakeGame;