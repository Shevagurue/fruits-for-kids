import { Home, RotateCcw, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarCelebrationProps {
  title: string;
  subtitle: string;
  score: number;
  maxScore?: number;
  stars: number;
  extraStats?: Array<{ label: string; value: string }>;
  onPlayAgain: () => void;
  onHome: () => void;
  onBackToGames?: () => void;
}

export function StarCelebration({
  title,
  subtitle,
  score,
  maxScore = 100,
  stars,
  extraStats,
  onPlayAgain,
  onHome,
  onBackToGames
}: StarCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-10 text-center shadow-sm"
    >
      {/* Animated Stars Row */}
      <div className="flex items-center justify-center gap-3 mb-6" aria-label={`${stars} dari 3 bintang`}>
        {[1, 2, 3].map((idx) => {
          const earned = idx <= stars;
          return (
            <motion.div
              key={idx}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.12 * idx,
                type: 'spring',
                stiffness: 260,
                damping: 16
              }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border ${
                earned
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-slate-50 border-slate-200 text-slate-300'
              }`}
            >
              <Star
                className="w-10 h-10 md:w-12 md:h-12"
                fill={earned ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </motion.div>
          );
        })}
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
        {title}
      </h2>
      <p className="text-slate-600 text-base md:text-lg mb-6 max-w-md mx-auto">
        {subtitle}
      </p>

      {/* Score Showcase */}
      <div className="bg-[#FAF8F2] border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Skor Kamu
        </div>
        <div className="font-display text-4xl md:text-5xl font-bold text-emerald-600 tabular-nums">
          {score}
          <span className="text-xl text-slate-400 font-semibold"> / {maxScore}</span>
        </div>

        {extraStats && extraStats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-sm">
            {extraStats.map((stat) => (
              <div key={stat.label} className="text-slate-600">
                <span className="text-slate-400">{stat.label}: </span>
                <span className="font-bold text-slate-800 tabular-nums">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-display text-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-5 h-5" />
          PLAY AGAIN
        </button>

        {onBackToGames && (
          <button
            type="button"
            onClick={onBackToGames}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-display text-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Pilih Game Lain
          </button>
        )}

        <button
          type="button"
          onClick={onHome}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-display text-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Home className="w-5 h-5" />
          HOME
        </button>
      </div>
    </motion.div>
  );
}
