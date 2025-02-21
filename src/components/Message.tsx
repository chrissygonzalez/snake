const Message = ({ isLoser, isPlaying, handleResetGame }:
    { isLoser: boolean, isPlaying: boolean, handleResetGame: () => void }) => {
    let text = isLoser ? "Game over" : "Hit any key to start";

    return (
        <div className={['message', isPlaying && 'message--hide'].filter(Boolean).join(" ")}>
            <p>{text}</p>
            {isLoser && !isPlaying && <button onClick={handleResetGame}>Reset</button>}
        </div>
    )
}

export default Message;