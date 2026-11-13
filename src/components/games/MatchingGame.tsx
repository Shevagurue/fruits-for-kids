import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
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

interface MatchingGameProps {
  soundEnabled: boolean;
  onFinish: (score: number) => void;
  onBackToGames: () => void;
  onHome: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MatchingGame({
  soundEnabled,
  onFinish,
  onBackToGames,
  onHome
}: MatchingGameProps) {
  const [seed, setSeed] = useState(0);
  const stages = useMemo(() => {
    const all = shuffle(FRUITS);
    return [all.slice(0, 5), all.slice(5, 10)];
  }, [seed]);

  const [stageIdx, setStageIdx] = useState(0);
  const currentFruits = stages[stageIdx];

  const shuffledImages = useMemo(() => shuffle(currentFruits), [currentFruits]);
  const shuffledWords = useMemo(() => shuffle(currentFruits), [currentFruits]);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    text: string;
  } | null>(null);
  const [draggedFruitId, setDraggedFruitId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(100);

  const evaluatePair = (imageId: string, wordId: string) => {
    if (matchedIds.includes(imageId) || matchedIds.includes(wordId)) return;

    if (imageId === wordId) {
      const matchedFruit = currentFruits.find((f) => f.id === imageId);
      const updated = [...matchedIds, imageId];
      setMatchedIds(updated);
      setSelectedImageId(null);
      setSelectedWordId(null);
      setFeedback({
        type: 'correct',
        text: `EXCELLENT! ${matchedFruit?.english} (${matchedFruit?.indonesian}) cocok!`
      });
      playCorrectSound(soundEnabled);
      if (matchedFruit) {
        setTimeout(() => {
          speakEnglish(matchedFruit.english, { soundEnabled });
        }, 200);
      }
    } else {
      setMistakes((m) => m + 1);
      setSelectedImageId(null);
      setSelectedWordId(null);
      setFeedback({
        type: 'wrong',
        text: 'TRY AGAIN! YOU CAN DO IT!'
      });
      playTryAgainSound(soundEnabled);
    }
  };

  const handleClickImage = (fruit: FruitItem) => {
    if (matchedIds.includes(fruit.id)) return;
    playClickSound(soundEnabled);
    if (selectedWordId) {
      evaluatePair(fruit.id, selectedWordId);
    } else {
      setSelectedImageId((prev) => (prev === fruit.id ? null : fruit.id));
    }
  };

  const handleClickWord = (fruit: FruitItem) => {
    if (matchedIds.includes(fruit.id)) return;
    playClickSound(soundEnabled);
    if (selectedImageId) {
      evaluatePair(selectedImageId, fruit.id);
    } else {
      setSelectedWordId((prev) => (prev === fruit.id ? null : fruit.id));
    }
  };

  const handleNextStage = () => {
    playClickSound(soundEnabled);
    if (stageIdx + 1 >= stages.length) {
      const computed = Math.max(50, 100 - mistakes * 5);
      setFinalScore(computed);
      onFinish(computed);
      playVictorySound(soundEnabled);
      setFinished(true);
    } else {
      setStageIdx((prev) => prev + 1);
      setMatchedIds([]);
      setSelectedImageId(null);
      setSelectedWordId(null);
      setFeedback(null);
    }
  };

  const handlePlayAgain = () => {
    playClickSound(soundEnabled);
    setSeed((s) => s + 1);
    setStageIdx(0);
    setMatchedIds([]);
    setSelectedImageId(null);
    setSelectedWordId(null);
    setMistakes(0);
    setFeedback(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <StarCelebration
        title="HEBAT! SEMUA COCOK!"
        subtitle="Kamu berhasil mencocokkan semua 10 gambar buah dengan namanya!"
        score={finalScore}
        maxScore={100}
        stars={calculateStarsFromScore(finalScore, 100)}
        extraStats={[{ label: 'Salah Coba', value: `${mistakes}x` }]}
        onPlayAgain={handlePlayAgain}
        onBackToGames={onBackToGames}
        onHome={onHome}
      />
    );
  }

  const stageComplete = matchedIds.length === currentFruits.length;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Matching Game
          </h2>
          <p className="text-sm text-slate-600">
            Seret gambar ke nama buah, atau klik gambar lalu klik nama Bahasa Inggrisnya!
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold tabular-nums">
          <span className="text-slate-600">
            Tahap {stageIdx + 1} / {stages.length}
          </span>
          <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            Cocok: {matchedIds.length} / {currentFruits.length}
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          key={feedback.text + matchedIds.length + mistakes}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 rounded-2xl px-4 py-3 border flex items-center justify-between gap-3 ${
            feedback.type === 'correct'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-display text-base sm:text-lg font-bold">
            {feedback.type === 'correct' && <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
          {stageComplete && (
            <button
              type="button"
              onClick={handleNextStage}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display text-base font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{stageIdx + 1 >= stages.length ? 'LIHAT SKOR' : 'TAHAP 2'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}

      {/* Two-Column Matching Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        {/* Column 1: Fruit Images */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Gambar Buah
          </div>
          {shuffledImages.map((fruit) => {
            const matched = matchedIds.includes(fruit.id);
            const selected = selectedImageId === fruit.id;
            return (
              <motion.button
                key={fruit.id}
                type="button"
                disabled={matched}
                draggable={!matched}
                onDragStart={() => setDraggedFruitId(fruit.id)}
                onDragEnd={() => setDraggedFruitId(null)}
                onDragOver={(e) => {
                  if (!matched) e.preventDefault();
                }}
                onDrop={() => {
                  if (draggedFruitId && !matched) {
                    evaluatePair(fruit.id, draggedFruitId);
                    setDraggedFruitId(null);
                  }
                }}
                onClick={() => handleClickImage(fruit)}
                animate={matched ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.25 }}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                  matched
                    ? 'bg-emerald-50 border-emerald-400 opacity-75 cursor-default'
                    : selected
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 cursor-pointer'
                      : 'bg-white hover:bg-slate-50 border-slate-200 cursor-grab active:cursor-grabbing'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-slate-200 p-1 shrink-0">
                    <FruitImage fruit={fruit} className="w-full h-full rounded-lg" />
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    {matched ? fruit.indonesian : 'Pilih atau seret'}
                  </span>
                </div>
                {matched && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mr-2" />}
              </motion.button>
            );
          })}
        </div>

        {/* Column 2: English Names */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Nama Bahasa Inggris
          </div>
          {shuffledWords.map((fruit) => {
            const matched = matchedIds.includes(fruit.id);
            const selected = selectedWordId === fruit.id;
            return (
              <motion.button
                key={fruit.id}
                type="button"
                disabled={matched}
                draggable={!matched}
                onDragStart={() => setDraggedFruitId(fruit.id)}
                onDragEnd={() => setDraggedFruitId(null)}
                onDragOver={(e) => {
                  if (!matched) e.preventDefault();
                }}
                onDrop={() => {
                  if (draggedFruitId && !matched) {
                    evaluatePair(draggedFruitId, fruit.id);
                    setDraggedFruitId(null);
                  }
                }}
                onClick={() => handleClickWord(fruit)}
                animate={matched ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.25 }}
                className={`w-full min-h-[90px] sm:min-h-[106px] px-6 py-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                  matched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 cursor-default'
                    : selected
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 text-sky-900 cursor-pointer'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 cursor-pointer'
                }`}
              >
                <span className="font-display text-2xl sm:text-3xl font-bold">
                  {fruit.english}
                </span>
                {matched && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
