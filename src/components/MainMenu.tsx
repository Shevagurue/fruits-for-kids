import {
  Award,
  BookOpen,
  Gamepad2,
  HelpCircle,
  Mic,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { FRUITS } from '../data/fruits';
import { ScreenId, StudentProgress } from '../types';

interface MainMenuProps {
  progress: StudentProgress;
  onSelectScreen: (screen: ScreenId) => void;
}

const MENU_CARDS: Array<{
  id: ScreenId;
  title: string;
  subtitleId: string;
  description: string;
  icon: typeof BookOpen;
  iconBg: string;
  iconColor: string;
}> = [
  {
    id: 'learn',
    title: "Let's Learn",
    subtitleId: 'Belajar',
    description: 'Kenali 10 nama buah dalam Bahasa Inggris, arti, dan suaranya.',
    icon: BookOpen,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'listen',
    title: 'Listen and Repeat',
    subtitleId: 'Dengarkan dan Ucapkan',
    description: 'Dengarkan pelafalan dengan jelas lalu tirukan ucapannya.',
    icon: Mic,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700'
  },
  {
    id: 'play',
    title: "Let's Play",
    subtitleId: 'Permainan',
    description: 'Mainkan 5 permainan seru: Tebak Buah, Cocokkan, Dengar, Memori & Kalimat.',
    icon: Gamepad2,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700'
  },
  {
    id: 'quiz',
    title: 'Quiz Time',
    subtitleId: 'Kuis',
    description: 'Jawab 10 soal pilihan ganda bergambar dan raih predikat terbaik!',
    icon: HelpCircle,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700'
  },
  {
    id: 'score',
    title: 'My Score',
    subtitleId: 'Nilai Saya',
    description: 'Lihat progres belajar buah, bintang, dan semua skor permainanmu.',
    icon: Award,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700'
  }
];

export function MainMenu({ progress, onSelectScreen }: MainMenuProps) {
  const learnedCount = progress.learnedFruitIds.length;
  const totalFruits = FRUITS.length;
  const totalStars =
    Object.values(progress.gameScores).reduce((sum, g) => sum + g.stars, 0) +
    (progress.quiz.attempts > 0 ? (progress.quiz.bestScore >= 70 ? 3 : progress.quiz.bestScore >= 50 ? 2 : 1) : 0);

  const progressPct = Math.round((learnedCount / totalFruits) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header & Student Learning Progress */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
              Menu Utama Belajar Buah
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Halo! Pilih kegiatan belajarmu di bawah ini ya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <div className="text-slate-500 font-medium">Buah Dipelajari</div>
              <div className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
                {learnedCount} / {totalFruits}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-slate-500 font-medium">Bintang Terkumpul</div>
              <div className="font-display text-2xl font-bold text-amber-600 tabular-nums flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                {totalStars}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-slate-500 font-medium">Nilai Kuis Terbaik</div>
              <div className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                {progress.quiz.attempts > 0 ? progress.quiz.bestScore : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Progres Mengenal 10 Buah</span>
            <span className="tabular-nums">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Main Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MENU_CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              onClick={() => onSelectScreen(card.id)}
              className="group text-left bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    0{index + 1}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h2>
                <p className="text-sm font-semibold text-emerald-700 mb-2">
                  {card.subtitleId}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                <span>Buka Menu</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
