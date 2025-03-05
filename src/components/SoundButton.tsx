import NoteOn from "./NoteOn";
import NoteOff from "./NoteOff";

const SoundButton = ({ soundOn, setSoundOn }: { soundOn: boolean, setSoundOn: React.Dispatch<React.SetStateAction<boolean>> }) => {

    return (
        <button type="button" aria-label='Sound button' onClick={(e) => {
            setSoundOn(!soundOn);
            e.currentTarget.blur();
        }}>
            {soundOn ? <NoteOn color={"pink"} /> : <NoteOff color={"pink"} />}
        </button>
    )
}

export default SoundButton;