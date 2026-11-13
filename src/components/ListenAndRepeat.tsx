import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Mic,
  RotateCcw,
  Turtle,
  Volume2
} from 'lucide-react';
import { FRUITS } from '../data/fruits';
import { playClickSound, playCorrectSound, speakEnglish } from '../utils/audio';
import { FruitImage } from './FruitImage';

interface ListenAndRepeatProps {
  soundEnabled: boolean;
  spokenFruitIds: string[];
  onMarkSpoken: (fruitId: string) => void;
  onHome: () => void;
}

interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

export function ListenAndRepeat({
  soundEnabled,
  spokenFruitIds,
  onMarkSpoken,
  onHome
}: ListenAndRepeatProps) {
  const [index, setIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<{
    type: 'success' | 'retry' | 'info';
    message: string;
  } | null>(null);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const currentFruit = FRUITS[index];
  const isCompleted = spokenFruitIds.includes(currentFruit.id);

  const hasSpeechRec =
    typeof window !== 'undefined' &&
    Boolean(
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const handleListen = (rate = 0.85) => {
    setSpeechFeedback(null);
    speakEnglish(currentFruit.english, {
      soundEnabled,
      rate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  const handleTryMic = () => {
    if (!hasSpeechRec) {
      handleSelfCheck();
      return;
    }

    const SpeechRecCtor =
      (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecCtor) {
      handleSelfCheck();
      return;
    }

    try {
      const recognition = new SpeechRecCtor();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      setIsListeningMic(true);
      setSpeechFeedback({
        type: 'info',
        message: `Ucapkan "${currentFruit.english}" dengan jelas sekarang...`
      });

      recognition.onresult = (event) => {
        setIsListeningMic(false);
        const target = currentFruit.english.toLowerCase();
        const transcripts: string[] = [];
        for (let i = 0; i < event.results[0].length; i++) {
          transcripts.push(event.results[0][i].transcript.toLowerCase().trim());
        }
        const matched = transcripts.some(
          (t) => t.includes(target) || target.includes(t)
        );
        if (matched) {
          playCorrectSound(soundEnabled);
          onMarkSpoken(currentFruit.id);
          setSpeechFeedback({
            type: 'success',
            message: `EXCELLENT! Hebat, kamu mengucapkan "${currentFruit.english}" dengan tepat!`
          });
        } else {
          setSpeechFeedback({
            type: 'retry',
            message: `Terdengar "${transcripts[0] || '...'}". Ayo dengarkan lagi dan coba ucapkan "${currentFruit.english}"!`
          });
        }
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
        setSpeechFeedback({
          type: 'info',
          message: 'Mikrofon belum tersedia. Kamu tetap bisa berlatih lalu klik "Saya Sudah Mengucapkan!".'
        });
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch {
      setIsListeningMic(false);
      handleSelfCheck();
    }
  };

  const handleSelfCheck = () => {
    playCorrectSound(soundEnabled);
    onMarkSpoken(currentFruit.id);
    setSpeechFeedback({
      type: 'success',
      message: `GREAT JOB! Bagus sekali sudah berani mengucapkan "${currentFruit.english}"!`
    });
  };

  const handleChangeIndex = (nextIdx: number) => {
    playClickSound(soundEnabled);
    setIndex(nextIdx);
    setSpeechFeedback(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Listen and Repeat
          </h1>
          <p className="text-slate-600 text-base">
            Dengarkan pelafalan Bahasa Inggris, lalu tirukan dengan suara lantang!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-slate-600 tabular-nums">
            {spokenFruitIds.length} / {FRUITS.length} Dilatih
          </span>
          <button
            type="button"
            onClick={onHome}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Home className="w-4 h-4" />
            HOME
          </button>
        </div>
      </div>

      {/* Main Training Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-square rounded-3xl border border-slate-200 bg-white p-4">
              <FruitImage fruit={currentFruit} className="w-full h-full rounded-2xl" />
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="text-sm font-semibold text-slate-500 mb-2 tabular-nums">
              Langkah 1: Dengarkan · Langkah 2: Ucapkan ({index + 1} / {FRUITS.length})
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-1">
              {currentFruit.english}
            </h2>
            <p className="text-lg font-semibold text-emerald-700 mb-1">
              {currentFruit.indonesian}
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Panduan bunyi: <span className="font-bold text-slate-700">{currentFruit.pronunciation}</span>
            </p>

            {/* Listen Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => handleListen(0.85)}
                className={`min-h-[54px] px-6 py-3 rounded-2xl font-display text-lg font-semibold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSpeaking
                    ? 'bg-sky-700 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                <Volume2 className="w-6 h-6" />
                Dengarkan
              </button>

              <button
                type="button"
                onClick={() => handleListen(0.85)}
                className="min-h-[54px] px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display text-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-5 h-5" />
                REPEAT
              </button>

              <button
                type="button"
                onClick={() => handleListen(0.58)}
                className="min-h-[54px] px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-display text-base font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Turtle className="w-5 h-5 text-emerald-600" />
                Pelan
              </button>
            </div>

            {/* Practice Speaking Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                type="button"
                onClick={handleSelfCheck}
                className={`min-h-[50px] px-5 py-3 rounded-2xl font-display text-base sm:text-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                {isCompleted ? 'Sudah Diucapkan!' : 'Saya Sudah Mengucapkan!'}
              </button>

              {hasSpeechRec && (
                <button
                  type="button"
                  onClick={handleTryMic}
                  disabled={isListeningMic}
                  className={`min-h-[50px] px-5 py-3 rounded-2xl border font-display text-base font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isListeningMic
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <Mic className="w-5 h-5 text-rose-600" />
                  {isListeningMic ? 'Mendengarkan...' : 'Tes Suara Pakai Mik'}
                </button>
              )}
            </div>

            {/* Feedback Callout */}
            {speechFeedback && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold border ${
                  speechFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : speechFeedback.type === 'retry'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}
              >
                {speechFeedback.message}
              </div>
            )}

            {/* Prev / Next */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleChangeIndex((index - 1 + FRUITS.length) % FRUITS.length)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Buah Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => handleChangeIndex((index + 1) % FRUITS.length)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                Buah Berikutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Fruit Picker Strip */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
        {FRUITS.map((fruit, idx) => {
          const active = idx === index;
          const done = spokenFruitIds.includes(fruit.id);
          return (
            <button
              key={fruit.id}
              type="button"
              onClick={() => handleChangeIndex(idx)}
              className={`p-2 rounded-2xl bg-white border transition-all cursor-pointer flex flex-col items-center ${
                active
                  ? 'border-sky-600 ring-2 ring-sky-500/20'
                  : done
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 hover:border-slate-300'
              }`}
              title={fruit.english}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <FruitImage fruit={fruit} className="w-full h-full" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-1 truncate max-w-full">
                {fruit.english}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
