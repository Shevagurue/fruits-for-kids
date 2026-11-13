import { useState } from 'react';
import {
  ArrowLeft,
  Ear,
  Grid2x2,
  Home,
  Layers,
  MessageSquareMore,
  Sparkles,
  Star
} from 'lucide-react';
import { GameId, StudentProgress } from '../types';
import { playClickSound } from '../utils/audio';
import { GuessTheFruitGame } from './games/GuessTheFruitGame';
import { ListenAndChooseGame } from './games/ListenAndChooseGame';
import { MatchingGame } from './games/MatchingGame';
import { MemoryGame } from './games/MemoryGame';
import { WhatFruitIsThisGame } from './games/WhatFruitIsThisGame';

interface LetsPlayHubProps {
  soundEnabled: boolean;
  progress: StudentProgress;
  onSaveGameScore: (gameId: GameId, score: number) => void;
  onHome: () => void;
}

const GAME_CARDS: Array<{
  id: GameId;
  number: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  iconBg: string;
  iconColor: string;
}> = [
  {
    id: 'guess',
    number: 'Game 1',
    title: 'Guess the Fruit',
    description: 'Lihat gambar buah lalu pilih nama Bahasa Inggris yang tepat dari 3 pilihan.',
    icon: Sparkles,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'matching',
    number: 'Game 2',
    title: 'Matching Game',
    description: 'Cocokkan gambar buah dengan nama Bahasa Inggrisnya menggunakan seret atau klik.',
    icon: Layers,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700'
  },
  {
    id: 'listen-choose',
    number: 'Game 3',
    title: 'Listen and Choose',
    description: 'Dengarkan suara pelafalan Bahasa Inggris lalu pilih gambar buah yang sesuai.',
    icon: Ear,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700'
  },
  {
    id: 'memory',
    number: 'Game 4',
    title: 'Fruit Memory Game',
    description: 'Buka kartu tertutup untuk menemukan pasangan gambar dan nama buah.',
    icon: Grid2x2,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700'
  },
  {
    id: 'what-fruit',
    number: 'Game 5',
    title: 'What Fruit Is This?',
    description: 'Jawab pertanyaan "WHAT FRUIT IS THIS?" dengan kalimat Bahasa Inggris yang tepat.',
    icon: MessageSquareMore,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700'
  }
];

export function LetsPlayHub({
  soundEnabled,
  progress,
  onSaveGameScore,
  onHome
}: LetsPlayHubProps) {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const handleOpenGame = (gameId: GameId) => {
    playClickSound(soundEnabled);
    setActiveGame(gameId);
  };

  if (activeGame) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveGame(null);
            }}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Permainan
          </button>

          <button
            type="button"
            onClick={onHome}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Home className="w-4 h-4" />
            HOME
          </button>
        </div>

        {activeGame === 'guess' && (
          <GuessTheFruitGame
            soundEnabled={soundEnabled}
            onFinish={(s) => onSaveGameScore('guess', s)}
            onBackToGames={() => setActiveGame(null)}
            onHome={onHome}
          />
        )}

        {activeGame === 'matching' && (
          <MatchingGame
            soundEnabled={soundEnabled}
            onFinish={(s) => onSaveGameScore('matching', s)}
            onBackToGames={() => setActiveGame(null)}
            onHome={onHome}
          />
        )}

        {activeGame === 'listen-choose' && (
          <ListenAndChooseGame
            soundEnabled={soundEnabled}
            onFinish={(s) => onSaveGameScore('listen-choose', s)}
            onBackToGames={() => setActiveGame(null)}
            onHome={onHome}
          />
        )}

        {activeGame === 'memory' && (
          <MemoryGame
            soundEnabled={soundEnabled}
            onFinish={(s) => onSaveGameScore('memory', s)}
            onBackToGames={() => setActiveGame(null)}
            onHome={onHome}
          />
        )}

        {activeGame === 'what-fruit' && (
          <WhatFruitIsThisGame
            soundEnabled={soundEnabled}
            onFinish={(s) => onSaveGameScore('what-fruit', s)}
            onBackToGames={() => setActiveGame(null)}
            onHome={onHome}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Let&apos;s Play!
          </h1>
          <p className="text-slate-600 text-base">
            Pilih salah satu dari 5 permainan seru di bawah ini dan kumpulkan bintangnya!
          </p>
        </div>

        <button
          type="button"
          onClick={onHome}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Home className="w-4 h-4" />
          HOME
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAME_CARDS.map((card) => {
          const Icon = card.icon;
          const record = progress.gameScores[card.id];
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleOpenGame(card.id)}
              className="group text-left bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-amber-400 rounded-3xl p-6 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex items-center gap-1" aria-label={`${record.stars} bintang`}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= record.stars
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {card.number}
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {card.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="text-slate-500 tabular-nums">
                  Skor Terbaik: <strong className="text-slate-800">{record.bestScore}</strong>
                </span>
                <span className="font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  Mainkan →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
