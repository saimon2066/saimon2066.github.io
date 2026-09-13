// Interface sounds, synthesised with WebAudio rather than shipped as files:
// three blips at a few hundred bytes of code beats three requests, and the
// pitch and decay can be tuned in place.
//
// To swap in real samples instead, keep the play() signature and load buffers
// here; every caller goes through play(kind).

let context = null;
// Off on every load, deliberately not remembered: a site that makes noise at
// someone who only came to look is a site they close, and a visitor who
// turned it on last week will not remember doing it.
let enabled = false;
const listeners = new Set();

export function isEnabled() {
  return enabled;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setEnabled(next) {
  enabled = next;
  listeners.forEach(listener => listener(enabled));
  if (next) play('toggleOn');
}

const VOICES = {
  // [frequency, duration in seconds, peak gain, waveform]
  // hover fires constantly, so it is roughly a quarter the volume of a click
  // and half as long: felt rather than heard
  hover: [1560, 0.016, 0.012, 'triangle'],
  click: [880, 0.045, 0.05, 'square'],
  toggleOn: [660, 0.05, 0.045, 'square'],
  toggleOff: [420, 0.06, 0.04, 'square']
};

// Browsers refuse to start audio outside a user gesture, and a context
// created during a hover stays suspended for good. So the context is built
// and resumed on the first real gesture instead, once, and play() stays
// silent until then rather than firing oscillators into a dead context.
function unlock() {
  try {
    if (!context) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      context = new Ctor();
    }
    if (context.state === 'suspended') context.resume();
  } catch {
    // nothing to do, sound simply stays off
  }
}

if (typeof window !== 'undefined') {
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const onFirstGesture = () => {
    unlock();
    events.forEach(type => window.removeEventListener(type, onFirstGesture));
  };
  events.forEach(type => window.addEventListener(type, onFirstGesture, { passive: true }));
}

function emit(voice) {
  const [frequency, duration, peak, type] = voice;
  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  // a small downward slide stops it sounding like a beep from a microwave
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function play(kind = 'click') {
  if (!enabled) return;
  const voice = VOICES[kind];
  if (!voice) return;

  try {
    unlock();
    if (!context) return;

    if (context.state === 'running') {
      emit(voice);
      return;
    }

    // resume() is asynchronous, so the very first gesture used to lose its own
    // sound: the context was still suspended a microsecond later when the
    // oscillator was created. Wait for it instead, and drop the note if the
    // wait was long, which means there was no gesture and it would fire out
    // of context at some random later moment.
    const asked = Date.now();
    context
      .resume()
      .then(() => {
        if (context.state === 'running' && Date.now() - asked < 500) emit(voice);
      })
      .catch(() => {});
  } catch {
    // audio is a nicety, never let it break an interaction
  }
}
