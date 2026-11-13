import { useMemo, useState } from 'react';
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

interface GuessTheFruitGameProps {
  soundEnabled: boolean;
  onFinish: (score: number) => void;
  onBackToGames: () => void;
  onHome: () => void;
}

interface RoundData {
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

function buildRounds(): RoundData[] {
  return shuffle(FRUITS).map((target) => {
    const distractors = shuffle(FRUITS.filter((f) => f.id !== target.id)).slice(0, 2);
    return {
      target,
      options: shuffle([target, ...distractors])
    };
  });
}

export function GuessTheFruitGame({
  soundEnabled,
  onFinish,
  onBackToGames,
  onHome
}: GuessTheFruitGameProps) {
  const [seed, setSeed] = useState(0);
  const rounds = useMemo(() => buildRounds(), [seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [triedWrongIds, setTriedWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    text: string;
  } | null>(null);
  const [finished, setFinished] = useState(false);

  const current = rounds[roundIdx];

  const handleChoose = (option: FruitItem) => {
    if (solved) return;

    if (option.id === current.target.id) {
      const earned = triedWrongIds.length === 0 ? 10 : 5;
      const newScore = score + earned;
      setScore(newScore);
      setSolved(true);
      setFeedback({
        type: 'correct',
        text: 'EXCELLENT! YOU ARE RIGHT!'
      });
      playCorrectSound(soundEnabled);
      setTimeout(() => {
        speakEnglish(current.target.english, { soundEnabled });
      }, 280);
    } else {
      if (!triedWrongIds.includes(option.id)) {
        setTriedWrongIds((prev) => [...prev, option.id]);
      }
      setFeedback({
        type: 'wrong',
        text: 'TRY AGAIN! YOU CAN DO IT!'
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
      setTriedWrongIds([]);
      setSolved(false);
      setFeedback(null);
    }
  };

  const handlePlayAgain = () => {
    playClickSound(soundEnabled);
    setSeed((s) => s + 1);
    setRoundIdx(0);
    setScore(0);
    setTriedWrongIds([]);
    setSolved(false);
    setFeedback(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <StarCelebration
        title="HEBAT! SELESAI!"
        subtitle="Kamu sudah menebak semua 10 gambar buah dengan baik!"
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
            Guess the Fruit
          </h2>
          <p className="text-sm text-slate-500">
            Pilih nama buah Bahasa Inggris yang sesuai dengan gambar!
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm font-bold tabular-nums">
          <div className="text-slate-600">
            Ronde {roundIdx + 1} / {rounds.length}
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            Skor: {score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Fruit Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <motion.div
            key={current.target.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[270px] aspect-square rounded-3xl border border-slate-200 bg-white p-4"
          >
            <FruitImage fruit={current.target} className="w-full h-full rounded-2xl" />
          </motion.div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => speakEnglish(current.target.english, { soundEnabled })}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Dengar Suara
            </button>
            <button
              type="button"
              onClick={() => speakEnglish(current.target.english, { soundEnabled })}
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              REPEAT
            </button>
          </div>
        </div>

        {/* 3 Choices */}
        <div className="md:col-span-7">
          <div className="space-y-3.5 mb-6">
            {current.options.map((option) => {
              const isTarget = option.id === current.target.id;
              const isWrongTried = triedWrongIds.includes(option.id);

              let style =
                'bg-white hover:bg-slate-50 border-slate-300 text-slate-900';

              if (solved && isTarget) {
                style = 'bg-emerald-50 border-emerald-500 text-emerald-900';
              } else if (isWrongTried) {
                style = 'bg-amber-50/70 border-amber-300 text-amber-800 opacity-75';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={solved || isWrongTried}
                  onClick={() => handleChoose(option)}
                  className={`w-full min-h-[60px] px-6 py-4 rounded-2xl border-2 font-display text-xl sm:text-2xl font-bold text-left flex items-center justify-between transition-all ${
                    solved || isWrongTried
                      ? 'cursor-default'
                      : 'cursor-pointer active:scale-[0.99]'
                  } ${style}`}
                >
                  <span>{option.english}</span>
                  {solved && isTarget && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

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
              <div className="flex items-center gap-2 font-display text-lg font-bold">
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
      </div>
    </div>
  );
}
