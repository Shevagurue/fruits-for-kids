import { useState } from 'react';
import { Award, CheckCircle2, Home, RotateCcw, Star, Trophy } from 'lucide-react';
import { FRUITS } from '../data/fruits';
import { GameId, ScreenId, StudentProgress } from '../types';
import { getQuizPredicate } from '../utils/storage';
import { FruitImage } from './FruitImage';

interface MyScoreProps {
  progress: StudentProgress;
  onNavigate: (screen: ScreenId) => void;
  onResetProgress: () => void;
}

const GAME_META: Array<{ id: GameId; title: string; subtitle: string }> = [
  { id: 'guess', title: 'Game 1: Guess the Fruit', subtitle: 'Tebak nama buah dari gambar' },
  { id: 'matching', title: 'Game 2: Matching Game', subtitle: 'Cocokkan gambar & nama buah' },
  { id: 'listen-choose', title: 'Game 3: Listen and Choose', subtitle: 'Dengar suara & pilih gambar' },
  { id: 'memory', title: 'Game 4: Fruit Memory Game', subtitle: 'Temukan pasangan kartu tertutup' },
  { id: 'what-fruit', title: 'Game 5: What Fruit Is This?', subtitle: 'Lengkapi kalimat Bahasa Inggris' }
];

export function MyScore({ progress, onNavigate, onResetProgress }: MyScoreProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const gameStars = Object.values(progress.gameScores).reduce((sum, g) => sum + g.stars, 0);
  const quizStars =
    progress.quiz.attempts > 0
      ? getQuizPredicate(progress.quiz.bestScore).stars
      : 0;
  const totalStars = gameStars + quizStars;
  const maxStars = GAME_META.length * 3 + 3;

  const quizPredicate =
    progress.quiz.attempts > 0
      ? getQuizPredicate(progress.quiz.bestScore)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            My Score & Progress
          </h1>
          <p className="text-slate-600 text-base">
            Catatan belajarmu tersimpan otomatis di perangkat ini tanpa perlu akun.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Home className="w-4 h-4" />
          HOME
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-500">Buah Dipelajari</div>
          </div>
          <div className="font-display text-4xl font-bold text-slate-900 tabular-nums">
            {progress.learnedFruitIds.length}
            <span className="text-xl text-slate-400"> / {FRUITS.length}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {progress.spokenFruitIds.length} buah sudah dilatih pengucapannya
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div className="text-sm font-semibold text-slate-500">Total Bintang</div>
          </div>
          <div className="font-display text-4xl font-bold text-slate-900 tabular-nums">
            {totalStars}
            <span className="text-xl text-slate-400"> / {maxStars}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kumpulkan bintang dari semua permainan dan kuis!
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-500">Nilai Quiz Time</div>
          </div>
          <div className="font-display text-4xl font-bold text-slate-900 tabular-nums">
            {progress.quiz.attempts > 0 ? progress.quiz.bestScore : '-'}
            {progress.quiz.attempts > 0 && (
              <span className="text-xl text-slate-400"> / 100</span>
            )}
          </div>
          <p className="text-xs font-semibold text-emerald-700 mt-1">
            {quizPredicate
              ? `Predikat Terbaik: ${quizPredicate.title}`
              : 'Belum mengerjakan kuis'}
          </p>
        </div>
      </div>

      {/* Game Scores Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Skor Permainan (Let&apos;s Play)
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('play')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            Main Game
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {GAME_META.map((game) => {
            const record = progress.gameScores[game.id];
            return (
              <div
                key={game.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-display text-lg font-bold text-slate-900">
                    {game.title}
                  </div>
                  <div className="text-sm text-slate-500">{game.subtitle}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <span className="text-slate-400">Dimainkan: </span>
                    <span className="font-bold text-slate-700 tabular-nums">{record.plays}x</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400">Skor Terbaik: </span>
                    <span className="font-display text-lg font-bold text-emerald-700 tabular-nums">
                      {record.bestScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" aria-label={`${record.stars} bintang`}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${
                          s <= record.stars
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10 Fruits Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Daftar 10 Buah yang Dikuasai
            </h2>
            <p className="text-sm text-slate-500">
              Buah bertanda centang hijau sudah kamu pelajari di menu Let&apos;s Learn.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            Buka Let&apos;s Learn
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {FRUITS.map((fruit) => {
            const learned = progress.learnedFruitIds.includes(fruit.id);
            return (
              <div
                key={fruit.id}
                className={`rounded-2xl p-3 border flex items-center gap-3 ${
                  learned
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 shrink-0">
                  <FruitImage fruit={fruit} className="w-full h-full rounded-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-slate-900 truncate">
                    {fruit.english}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{fruit.indonesian}</div>
                </div>
                {learned && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Classroom Teacher Reset Option */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="text-sm text-slate-600">
            Ingin mengulang progres belajar dari awal untuk siswa berikutnya?
          </p>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Nilai
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold cursor-pointer"
            >
              Ya, Hapus Nilai
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
