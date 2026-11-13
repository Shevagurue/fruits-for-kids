import { useEffect, useState } from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { FRUITS } from '../../data/fruits';
import { FruitItem } from '../../types';
import {
  playCorrectSound,
  playFlipSound,
  playVictorySound,
  speakEnglish
} from '../../utils/audio';
import { calculateStarsFromScore } from '../../utils/storage';
import { FruitImage } from '../FruitImage';
import { StarCelebration } from '../StarCelebration';

interface MemoryGameProps {
  soundEnabled: boolean;
  onFinish: (score: number) => void;
  onBackToGames: () => void;
  onHome: () => void;
}

interface MemoryCard {
  uid: string;
  fruit: FruitItem;
  kind: 'image' | 'word';
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(pairCount: number): MemoryCard[] {
  const picked = shuffle(FRUITS).slice(0, pairCount);
  const cards: MemoryCard[] = [];
  picked.forEach((fruit) => {
    cards.push({ uid: `${fruit.id}-img`, fruit, kind: 'image' });
    cards.push({ uid: `${fruit.id}-word`, fruit, kind: 'word' });
  });
  return shuffle(cards);
}

function formatSeconds(sec: number): string {
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function MemoryGame({
  soundEnabled,
  onFinish,
  onBackToGames,
  onHome
}: MemoryGameProps) {
  const [pairCount, setPairCount] = useState(6);
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck(6));
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedFruitIds, setMatchedFruitIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(100);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, deck]);

  const restartGame = (newPairCount = pairCount) => {
    setPairCount(newPairCount);
    setDeck(createDeck(newPairCount));
    setFlippedUids([]);
    setMatchedFruitIds([]);
    setAttempts(0);
    setSeconds(0);
    setLocked(false);
    setFinished(false);
  };

  const handleCardClick = (card: MemoryCard) => {
    if (locked) return;
    if (matchedFruitIds.includes(card.fruit.id)) return;
    if (flippedUids.includes(card.uid)) return;

    playFlipSound(soundEnabled);
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      const firstCard = deck.find((c) => c.uid === nextFlipped[0]);
      const secondCard = deck.find((c) => c.uid === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.fruit.id === secondCard.fruit.id) {
        const nextMatched = [...matchedFruitIds, firstCard.fruit.id];
        setMatchedFruitIds(nextMatched);
        setFlippedUids([]);
        setLocked(false);
        playCorrectSound(soundEnabled);
        setTimeout(() => {
          speakEnglish(firstCard.fruit.english, { soundEnabled });
        }, 200);

        if (nextMatched.length === pairCount) {
          const extraMoves = Math.max(0, nextAttempts - pairCount);
          const computed = Math.max(60, 100 - extraMoves * 4);
          setFinalScore(computed);
          onFinish(computed);
          setTimeout(() => {
            playVictorySound(soundEnabled);
            setFinished(true);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlippedUids([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  if (finished) {
    return (
      <StarCelebration
        title="INGATAN HEBAT!"
        subtitle="Kamu berhasil menemukan semua pasangan gambar dan nama buah!"
        score={finalScore}
        maxScore={100}
        stars={calculateStarsFromScore(finalScore, 100)}
        extraStats={[
          { label: 'Percobaan', value: `${attempts} kali` },
          { label: 'Waktu Bermain', value: formatSeconds(seconds) }
        ]}
        onPlayAgain={() => restartGame(pairCount)}
        onBackToGames={onBackToGames}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* HUD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Fruit Memory Game
          </h2>
          <p className="text-sm text-slate-600">
            Buka 2 kartu untuk menemukan pasangan gambar buah dan nama Bahasa Inggrisnya!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-bold tabular-nums">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {[6, 8, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => restartGame(count)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  pairCount === count
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {count} Pasang
              </button>
            ))}
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800">
            Percobaan: {attempts}
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
            Waktu: {formatSeconds(seconds)}
          </div>
          <button
            type="button"
            onClick={() => restartGame(pairCount)}
            className="min-h-[38px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Acak Ulang
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          pairCount === 6
            ? 'grid-cols-3 sm:grid-cols-4'
            : pairCount === 8
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-5'
        }`}
      >
        {deck.map((card) => {
          const isMatched = matchedFruitIds.includes(card.fruit.id);
          const isOpen = isMatched || flippedUids.includes(card.uid);

          return (
            <button
              key={card.uid}
              type="button"
              disabled={isOpen}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-2xl border-2 p-2.5 sm:p-3 flex flex-col items-center justify-center transition-all duration-200 ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 cursor-default'
                  : isOpen
                    ? 'bg-white border-sky-500 shadow-xs cursor-default'
                    : 'bg-amber-400 hover:bg-amber-500 border-amber-500 text-white cursor-pointer active:scale-[0.97]'
              }`}
              aria-label={
                isOpen
                  ? `${card.kind === 'image' ? 'Gambar' : 'Kata'} ${card.fruit.english}`
                  : 'Kartu tertutup'
              }
            >
              {!isOpen ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white/95" />
                  <span className="font-display text-xs font-bold tracking-wide text-amber-950/80">
                    FRUITS
                  </span>
                </div>
              ) : card.kind === 'image' ? (
                <div className="w-full h-full rounded-xl bg-white p-1">
                  <FruitImage fruit={card.fruit} className="w-full h-full rounded-lg" />
                </div>
              ) : (
                <div className="text-center px-1">
                  <span className="font-display text-base sm:text-xl font-bold text-slate-900 break-words">
                    {card.fruit.english}
                  </span>
                  {isMatched && (
                    <span className="block text-xs font-semibold text-emerald-700 mt-1">
                      {card.fruit.indonesian}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
