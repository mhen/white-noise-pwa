if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js');
}

const audioContext = new AudioContext();

const whiteNoiseBuffer = createWhiteNoiseBuffer();

const gainMin = 0.0;
const gainDefault = 1.0;
const gainMax = 3.0;
const gainStep = 0.5;

let isPlaying = false;
let currentlyPlayingNoise = null;
let currentGain = null;

let playPauseButton = document.querySelector('#play-pause');
let playIcon = document.querySelector('#play-icon');
let pauseIcon = document.querySelector('#pause-icon');
playPauseButton.addEventListener('click', function() {
    if (isPlaying) {
        currentlyPlayingNoise.stop();
        pauseIcon.classList.toggle('icon-hidden')
        playIcon.classList.toggle('icon-hidden')
        isPlaying = false;
    }
    else {
        ({ noiseSource: currentlyPlayingNoise, noiseGain: currentGain } = createWhiteNoise(whiteNoiseBuffer));
        currentlyPlayingNoise.start();
        pauseIcon.classList.toggle('icon-hidden')
        playIcon.classList.toggle('icon-hidden')
        isPlaying = true;
    }
});

let volumeUpButton = document.querySelector('#volume-up');
volumeUpButton.addEventListener('click', function() {
    let nextGain = Math.min(currentGain.gain.value + gainStep, gainMax)
    currentGain.gain.setValueAtTime(nextGain, audioContext.currentTime);
});

let volumeDownButton = document.querySelector('#volume-down');
volumeDownButton.addEventListener('click', function() {
    let nextGain = Math.max(currentGain.gain.value - gainStep, gainMin)
    currentGain.gain.setValueAtTime(nextGain, audioContext.currentTime);
});

function createWhiteNoise(whiteNoiseBuffer) {
    let whiteNoiseBufferSource = audioContext.createBufferSource();
    let gainNode = audioContext.createGain();
    gainNode.value = gainDefault;
    whiteNoiseBufferSource.buffer = whiteNoiseBuffer;
    whiteNoiseBufferSource.loop = true;
    whiteNoiseBufferSource.connect(gainNode);
    gainNode.connect(audioContext.destination)
    return { noiseSource: whiteNoiseBufferSource, noiseGain: gainNode };
}

function createWhiteNoiseBuffer() {
    let whiteNoiseBuffer = audioContext.createBuffer(2, 5 * audioContext.sampleRate, audioContext.sampleRate);
    for (let channel = 0; channel < whiteNoiseBuffer.numberOfChannels; channel++)
    {
        let channelBuffer = whiteNoiseBuffer.getChannelData(channel);
        for (let sample = 0; sample < channelBuffer.length; sample++)
        {
            channelBuffer[sample] = 2.0 * Math.random() - 1.0;
        }
    }
    return whiteNoiseBuffer;
}
