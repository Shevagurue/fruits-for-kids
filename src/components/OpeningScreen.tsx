import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { FRUITS, HERO_IMAGE_PATH } from '../data/fruits';
import { FruitImage } from './FruitImage';

interface OpeningScreenProps {
  soundEnabled: boolean;
  onStart: () => void;
  onToggleSound: () => void;
}

export function OpeningScreen({
  soundEnabled,
  onStart,
  onToggleSound
}: OpeningScreenProps) {
  const [heroError, setHeroError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      {/* Minimal top strip */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-600">
          Bahasa Inggris Kelas 2 SD · Tema Buah-buahan
        </div>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            soundEnabled
              ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>SOUND OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Copy & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-sm font-bold text-emerald-700 tracking-wide uppercase mb-3">
              Media Pembelajaran Interaktif
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.08] mb-4">
              LET&apos;S LEARN ABOUT FRUITS!
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 font-medium mb-8 max-w-lg leading-relaxed">
              Belajar Nama Buah dalam Bahasa Inggris.
            </p>

            {/* Quick preview of cute fruit friends */}
            <div className="flex items-center gap-3 mb-8">
              {FRUITS.slice(0, 5).map((fruit) => (
                <div
                  key={fruit.id}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 p-1 shadow-xs"
                  title={`${fruit.english} — ${fruit.indonesian}`}
                >
                  <FruitImage fruit={fruit} className="w-full h-full rounded-xl" />
                </div>
              ))}
              <span className="text-sm font-semibold text-slate-500 pl-1">
                +5 buah lainnya
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={onStart}
                className="min-h-[58px] px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-display text-xl sm:text-2xl font-bold shadow-sm inline-flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-6 h-6 fill-current" />
                MULAI BELAJAR
              </button>
              <p className="mt-3 text-sm text-slate-500">
                10 nama buah · Pelafalan suara · 5 game seru · Kuis berhadiah bintang
              </p>
            </div>
          </motion.div>

          {/* Right Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-6 flex"
          >
            <div className="w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              {!heroError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Karakter buah-buahan lucu sedang belajar bersama di taman buah"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroError(true)}
                  className="w-full h-full min-h-[280px] max-h-[460px] object-cover"
                />
              ) : (
                <div className="w-full min-h-[320px] p-8 bg-emerald-50 grid grid-cols-3 gap-4 items-center justify-items-center">
                  {FRUITS.slice(0, 6).map((fruit) => (
                    <FruitImage
                      key={fruit.id}
                      fruit={fruit}
                      className="w-24 h-24 rounded-2xl border border-slate-200 p-2"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
