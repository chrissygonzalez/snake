import { useEffect, useRef } from 'react';
import songUrl from '../assets/8-bit-music-on-245249.mp3';
import foodSoundUrl from '../assets/gameboy-pluck-41265.mp3'; // From https://pixabay.com
import { initializeBoard } from '../helpers/snakeHelpers';
import Board from './Board';
import Message from './Message';
import Controls from './Controls';
import useGameLogic from '../hooks/useGameLogic';

const COLUMNS = 40;
const ROWS = 30;
const SNAKE_LENGTH = 6;
const SNAKE_SPEED = 100;
const DELAY = 70;
let snakeDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP';

const SnakeGame = () => {
    const {
        isPlaying,
        setIsPlaying,
        isLoser, setIsLoser,
        matrix,
        setMatrix,
        score,
        setScore,
        updateSnakePosition,
        updateFoodPosition,
        snakeMap,
        showFood,
        isFood
    } = useGameLogic();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioRef2 = useRef<HTMLAudioElement | null>(null);
    const debounceRef = useRef<number | undefined>(undefined);

    const updateMatrix = () => {
        updateSnakePosition();
        updateFoodPosition();
        setMatrix(matrix => {
            let updatedMatrix = [...matrix];
            for (let i = 0; i < updatedMatrix.length; i++) {
                for (let j = 0; j < updatedMatrix[0].length; j++) {
                    if (snakeMap.has(`${i}-${j}`)) {
                        updatedMatrix[i][j] = snakeMap.get(`${i}-${j}`);
                    } else if (showFood && isFood(i, j)) {
                        updatedMatrix[i][j] = 'F';
                    } else {
                        updatedMatrix[i][j] = null;
                    }
                }
            }
            return updatedMatrix;
        });
    };

    const handleResetGame = () => {
        setIsLoser(false);
        setMatrix(() => initializeBoard(COLUMNS, ROWS, SNAKE_LENGTH));
        snakeDirection = 'UP';
        setScore(SNAKE_LENGTH);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
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

        if (!isPlaying) {
            setIsPlaying(true);
        }
        if (snakeDirection !== 'UP' && snakeDirection !== 'DOWN') {
            if (e.key === "ArrowUp") snakeDirection = 'UP';
            if (e.key === "ArrowDown") snakeDirection = 'DOWN';
        }
        if (snakeDirection !== 'LEFT' && snakeDirection !== 'RIGHT') {
            if (e.key === "ArrowLeft") snakeDirection = 'LEFT';
            if (e.key === "ArrowRight") snakeDirection = 'RIGHT';
        }

        // begin wait
        debounceRef.current = setTimeout(resetRef, DELAY)
    }

    useEffect(() => {
        let timer = 0;
        if (isPlaying) {
            audioRef.current?.play();
            timer = setInterval(updateMatrix, SNAKE_SPEED);
        } else {
            audioRef.current?.pause();
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        if (isLoser) document.removeEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLoser]);

    return (
        <div className="game">
            <img className="title" alt="SNAKE" src="snake.svg"></img>
            <div className="board">
                <Message isPlaying={isPlaying} isLoser={isLoser} />
                <Board matrix={matrix} />
                <Controls isPlaying={isPlaying} isLoser={isLoser} handleResetGame={handleResetGame} score={score} />
                <audio ref={audioRef} loop={true} src={songUrl} typeof='audio/mpeg' />
                <audio ref={audioRef2} src={foodSoundUrl} typeof='audio/mpeg' />
            </div>
        </div>
    )
}

export default SnakeGame;