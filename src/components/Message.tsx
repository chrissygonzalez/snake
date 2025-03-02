import { GameStates } from "../helpers/types";

const Message = ({ gameState }: { gameState: GameStates }) => {
    let text = null;
    if (gameState == GameStates.INITIAL) text = <p>Hit space to start / pause game<br />Use arrow keys to play</p>;
    if (gameState == GameStates.PAUSED) text = <p>Hit space to unpause game</p>;
    if (gameState === GameStates.ENDED) text = <p>Game over!</p>;

    return (
        <div className={['message', gameState === GameStates.RUNNING && 'message--hide'].filter(Boolean).join(" ")}>
            {text}
        </div>
    )
}

export default Message;