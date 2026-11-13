import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FRUITS } from '../../data/fruits';
import { FruitItem } from '../../types';
import {
  playClickSound,
  playCorrectSound,
  playTryAgainSound,
  playVictorySound,
  speakEnglish
} from '../../utils/audio';
import { calculateStarsFromScore } from '../../utils/storage';
import { FruitImage } from '../FruitImage';
import { StarCelebration } from '../StarCelebration';

interface ListenAndChooseGameProps {
  soundEnabled: boolean;
  onFinish: (score: number) => void;
  onBackToGames: () => void;
  onHome: () => void;
}

interface ListenRound {
  target: FruitItem;
  options: FruitItem[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRounds(): ListenRound[] {
  return shuffle(FRUITS).map((target) => {
    const others = shuffle(FRUITS.filter((f) => f.id !== target.id)).slice(0, 3);
    return {
      target,
      options: shuffle([target, ...others])
    };
  });
}

export function ListenAndChooseGame({
  soundEnabled,
  onFinish,
  onBackToGames,
  onHome
}: ListenAndChooseGameProps) {
  const [seed, setSeed] = useState(0);
  const rounds = useMemo(() => buildRounds(), [seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    text: string;
  } | null>(null);
  const [finished, setFinished] = useState(false);

  const current = rounds[roundIdx];

  useEffect(() => {
    if (!finished && current && soundEnabled) {
      const timer = setTimeout(() => {
        speakEnglish(current.target.english, { soundEnabled });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [roundIdx, seed, finished, current, soundEnabled]);

  const handlePlayWord = () => {
    speakEnglish(current.target.english, { soundEnabled, rate: 0.8 });
  };

  const handleSelectFruit = (fruit: FruitItem) => {
    if (solved) return;

    if (fruit.id === current.target.id) {
      const earned = wrongIds.length === 0 ? 10 : 5;
      setScore((s) => s + earned);
      setSolved(true);
      setFeedback({
        type: 'correct',
        text: `EXCELLENT! YOU ARE RIGHT! Itu adalah ${current.target.english} (${current.target.indonesian}).`
      });
      playCorrectSound(soundEnabled);
    } else {
      if (!wrongIds.includes(fruit.id)) {
        setWrongIds((prev) => [...prev, fruit.id]);
      }
      setFeedback({
        type: 'wrong',
        text: 'TRY AGAIN! YOU CAN DO IT! Tekan tombol speaker untuk dengar lagi.'
      });
      playTryAgainSound(soundEnabled);
    }
  };

  const handleNext = () => {
    playClickSound(soundEnabled);
    if (roundIdx + 1 >= rounds.length) {
      onFinish(score);
      playVictorySound(soundEnabled);
      setFinished(true);
    } else {
      setRoundIdx((prev) => prev + 1);
      setWrongIds([]);
      setSolved(false);
      setFeedback(null);
    }
  };

  const handlePlayAgain = () => {
    playClickSound(soundEnabled);
    setSeed((s) => s + 1);
    setRoundIdx(0);
    setScore(0);
    setWrongIds([]);
    setSolved(false);
    setFeedback(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <StarCelebration
        title="PENDENGARAN HEBAT!"
        subtitle="Kamu berhasil memilih gambar buah sesuai suara Bahasa Inggrisnya!"
        score={score}
        maxScore={100}
        stars={calculateStarsFromScore(score, 100)}
        onPlayAgain={handlePlayAgain}
        onBackToGames={onBackToGames}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Listen and Choose
          </h2>
          <p className="text-sm text-slate-600">
            Dengarkan suara nama buahnya, lalu klik gambar buah yang tepat!
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold tabular-nums">
          <span className="text-slate-600">
            Ronde {roundIdx + 1} / {rounds.length}
          </span>
          <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            Skor: {score}
          </span>
        </div>
      </div>

      {/* Audio Prompt Box */}
      <div className="bg-[#FAF8F2] border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Dengarkan Suara Buah Ini
          </div>
          <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            {solved ? current.target.english : 'Buah apakah yang disebutkan?'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePlayWord}
            className="min-h-[52px] px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-display text-lg font-bold flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-6 h-6" />
            Putar Suara
          </button>

          <button
            type="button"
            onClick={handlePlayWord}
            className="min-h-[52px] px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display text-lg font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-5 h-5" />
            REPEAT
          </button>
        </div>
      </div>

      {/* 4 Fruit Picture Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {current.options.map((fruit) => {
          const isTarget = fruit.id === current.target.id;
          const isWrong = wrongIds.includes(fruit.id);

          let cardStyle =
            'bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-400';

          if (solved && isTarget) {
            cardStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20';
          } else if (isWrong) {
            cardStyle = 'bg-amber-50/70 border-amber-300 opacity-60';
          }

          return (
            <button
              key={fruit.id}
              type="button"
              disabled={solved || isWrong}
              onClick={() => handleSelectFruit(fruit)}
              className={`rounded-3xl border-2 p-4 flex flex-col items-center justify-between transition-all ${
                solved || isWrong ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
              } ${cardStyle}`}
            >
              <div className="w-full aspect-square rounded-2xl bg-white p-2 mb-2">
                <FruitImage fruit={fruit} className="w-full h-full rounded-xl" />
              </div>

              <div className="min-h-[28px] flex items-center justify-center gap-1.5">
                {solved && isTarget ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-display text-lg font-bold text-emerald-900">
                      {fruit.english}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-slate-500">Pilih Buah</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            feedback.type === 'correct'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-display text-base sm:text-lg font-bold">
            {feedback.type === 'correct' && <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />}
            <span>{feedback.text}</span>
          </div>

          {solved && (
            <button
              type="button"
              onClick={handleNext}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display text-base font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{roundIdx + 1 >= rounds.length ? 'SELESAI' : 'NEXT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
