const Controls = ({ isPlaying, isLoser, handleResetGame, score }:
    { isLoser: boolean, isPlaying: boolean, handleResetGame: () => void, score: number }) => {
    return (
        <div className="controls">
            <div className="controls__score">
                <p>Score</p>
                <div className="controls__score__box">{score}</div>
            </div>
            {!isPlaying && isLoser && <button onClick={handleResetGame}>Reset</button>}
        </div>
    )
}

export default Controls;