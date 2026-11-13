import { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';
import { FRUITS } from '../data/fruits';
import { playClickSound, playCorrectSound, speakEnglish } from '../utils/audio';
import { FruitImage } from './FruitImage';

interface LetsLearnProps {
  soundEnabled: boolean;
  learnedFruitIds: string[];
  onMarkLearned: (fruitId: string) => void;
  onHome: () => void;
  onEnableSound: () => void;
}

export function LetsLearn({
  soundEnabled,
  learnedFruitIds,
  onMarkLearned,
  onHome,
  onEnableSound
}: LetsLearnProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundWarning, setSoundWarning] = useState(false);

  const currentFruit = FRUITS[selectedIndex];
  const isLearned = learnedFruitIds.includes(currentFruit.id);

  const handleSpeak = (text: string, markAfter = true) => {
    if (!soundEnabled) {
      setSoundWarning(true);
      return;
    }
    setSoundWarning(false);
    speakEnglish(text, {
      soundEnabled,
      rate: 0.85,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
    if (markAfter) {
      onMarkLearned(currentFruit.id);
    }
  };

  const handleSelectIndex = (idx: number) => {
    playClickSound(soundEnabled);
    setSelectedIndex(idx);
    setSoundWarning(false);
  };

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + FRUITS.length) % FRUITS.length;
    handleSelectIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % FRUITS.length;
    handleSelectIndex(nextIdx);
  };

  const handleToggleLearned = () => {
    playCorrectSound(soundEnabled);
    onMarkLearned(currentFruit.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Let&apos;s Learn Fruits!
          </h1>
          <p className="text-slate-600 text-base">
            Klik buah untuk melihat nama, arti, dan mendengarkan cara mengucapkannya.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-slate-600 tabular-nums">
            {learnedFruitIds.length} / {FRUITS.length} Buah Dipelajari
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

      {soundWarning && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm font-semibold text-amber-900">
            Suara sedang dalam mode mati (SOUND OFF). Nyalakan suara agar kamu bisa mendengar pelafalan Bahasa Inggris.
          </p>
          <button
            type="button"
            onClick={() => {
              onEnableSound();
              setSoundWarning(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            Nyalakan Suara
          </button>
        </div>
      )}

      {/* Main Spotlight Card */}
      <motion.div
        key={currentFruit.id}
        initial={{ opacity: 0.6, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Fruit Illustration */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className={`w-full max-w-[300px] aspect-square rounded-3xl border ${currentFruit.borderTint} bg-white p-4 flex items-center justify-center`}>
              <FruitImage fruit={currentFruit} className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {/* Word, Meaning & Audio Controls */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-2">
              <span className="tabular-nums">Buah {selectedIndex + 1} dari {FRUITS.length}</span>
              <span aria-hidden="true">·</span>
              <span>Cara baca: {currentFruit.pronunciation}</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-2">
              {currentFruit.english}
            </h2>
            <p className="text-2xl font-bold text-emerald-700 mb-3">
              Arti: {currentFruit.indonesian}
            </p>
            <p className="text-base sm:text-lg text-slate-700 bg-[#FAF8F2] border border-slate-200 rounded-2xl px-4 py-3 mb-6">
              Contoh kalimat: <span className="font-bold text-slate-900">&ldquo;{currentFruit.sentence}&rdquo;</span>
              <span className="block text-sm text-slate-500 mt-1">{currentFruit.funFactId}</span>
            </p>

            {/* Speaker & Repeat Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSpeak(currentFruit.english)}
                className={`min-h-[52px] px-6 py-3 rounded-2xl font-display text-lg font-semibold flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSpeaking
                    ? 'bg-emerald-700 text-white scale-[0.99]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Volume2 className="w-6 h-6" />
                Dengarkan Kata
              </button>

              <button
                type="button"
                onClick={() => handleSpeak(currentFruit.english)}
                className="min-h-[52px] px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display text-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-5 h-5" />
                REPEAT
              </button>

              <button
                type="button"
                onClick={() => handleSpeak(currentFruit.sentence)}
                className="min-h-[52px] px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-display text-base sm:text-lg font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Volume2 className="w-5 h-5" />
                Dengar Kalimat
              </button>
            </div>

            {/* Navigation & Mark Learned */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleLearned}
                className={`min-h-[44px] px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isLearned
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLearned ? 'Sudah Dipelajari!' : 'Tandai Sudah Hafal'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 10 Fruits Grid */}
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 mb-4">
          Semua 10 Nama Buah
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {FRUITS.map((fruit, idx) => {
            const active = idx === selectedIndex;
            const learned = learnedFruitIds.includes(fruit.id);
            return (
              <div
                key={fruit.id}
                className={`rounded-2xl bg-white border p-3.5 transition-all flex flex-col justify-between ${
                  active
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className="text-left w-full cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl bg-white p-1.5 mb-2.5">
                    <FruitImage fruit={fruit} className="w-full h-full rounded-lg" />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-lg font-bold text-slate-900 truncate">
                      {fruit.english}
                    </span>
                    {learned && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Sudah dipelajari" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-500 block">
                    {fruit.indonesian}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(idx);
                    handleSpeak(fruit.english, true);
                  }}
                  className="mt-3 w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Dengar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
