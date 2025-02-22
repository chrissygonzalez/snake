const Message = ({ isLoser, isPlaying }:
    { isLoser: boolean, isPlaying: boolean }) => {
    const text = isLoser ? "You lose!" : "Hit any key to start";

    return (
        <div className={['message', isPlaying && 'message--hide'].filter(Boolean).join(" ")}>
            <p>{text}</p>
        </div>
    )
}

export default Message;