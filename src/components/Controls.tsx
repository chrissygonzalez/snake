import { GameStates } from "../helpers/types";

const Controls = ({ gameState, handleResetGame, score }:
    { gameState: GameStates, handleResetGame: () => void, score: number }) => {
    return (
        <div className="controls">
            <div className="controls__score">
                <p>Score</p>
                <div className="controls__score__box">{score}</div>
            </div>
            {gameState === GameStates.ENDED && <button onClick={handleResetGame}>Reset</button>}
        </div>
    )
}

export default Controls;