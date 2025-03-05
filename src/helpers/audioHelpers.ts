export let audioCtx = new AudioContext();

async function getFile(filepath: string) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

export async function loadFile(filePath: string) {
    const track = await getFile(filePath);
    return track;
}

export function playTrack(audioBuffer: AudioBuffer) {
    if (audioCtx.state === 'running') {
        const trackSource = audioCtx.createBufferSource();
        trackSource.buffer = audioBuffer;
        trackSource.connect(audioCtx.destination);
        trackSource.start();
        return trackSource;
    }
}

export function turnSoundOff() {
    if (audioCtx.state !== 'closed') audioCtx.close();
}

export function turnSoundOn() {
    audioCtx = new AudioContext();
}