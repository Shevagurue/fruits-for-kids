let audioCtx: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function initVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const load = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferred =
    voices.find((v) => v.lang === 'en-US' && /google|samantha|natural|aria|jenny/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en-')) ||
    voices[0];

  return preferred || null;
}

export function speakEnglish(
  text: string,
  options?: {
    soundEnabled?: boolean;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): boolean {
  const enabled = options?.soundEnabled ?? true;
  if (!enabled) {
    options?.onEnd?.();
    return false;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = options?.rate ?? 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onEnd?.();

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options?.onEnd?.();
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function playTone(
  freq: number,
  startTimeOffset: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.14
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playClickSound(soundEnabled = true): void {
  if (!soundEnabled) return;
  playTone(540, 0, 0.06, 'sine', 0.09);
  playTone(720, 0.03, 0.06, 'sine', 0.06);
}

export function playFlipSound(soundEnabled = true): void {
  if (!soundEnabled) return;
  playTone(420, 0, 0.05, 'triangle', 0.08);
  playTone(620, 0.04, 0.07, 'triangle', 0.08);
}

export function playCorrectSound(soundEnabled = true): void {
  if (!soundEnabled) return;
  // Cheerful C5 - E5 - G5 - C6 chime
  playTone(523.25, 0, 0.14, 'triangle', 0.14);
  playTone(659.25, 0.09, 0.14, 'triangle', 0.14);
  playTone(783.99, 0.18, 0.18, 'triangle', 0.14);
  playTone(1046.5, 0.27, 0.32, 'sine', 0.16);
}

export function playTryAgainSound(soundEnabled = true): void {
  if (!soundEnabled) return;
  // Gentle encouraging marimba dip (not harsh)
  playTone(349.23, 0, 0.14, 'sine', 0.11);
  playTone(293.66, 0.12, 0.22, 'sine', 0.1);
}

export function playVictorySound(soundEnabled = true): void {
  if (!soundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 659.25, 1046.5];
  const offsets = [0, 0.11, 0.22, 0.34, 0.46];
  const durations = [0.14, 0.14, 0.14, 0.14, 0.45];
  notes.forEach((n, idx) => {
    playTone(n, offsets[idx], durations[idx], 'triangle', 0.15);
  });
}
