import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Home, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { FRUITS } from '../data/fruits';
import { FruitItem } from '../types';
import {
  playClickSound,
  playCorrectSound,
  playTryAgainSound,
  playVictorySound,
  speakEnglish
} from '../utils/audio';
import { getQuizPredicate } from '../utils/storage';
import { FruitImage } from './FruitImage';
import { StarCelebration } from './StarCelebration';

interface QuizQuestion {
  id: string;
  fruit: FruitItem;
  prompt: string;
  subPrompt: string;
  options: Array<{ label: string; value: string }>;
  correctValue: string;
}

interface QuizAnswerRecord {
  question: QuizQuestion;
  selectedValue: string;
  isCorrect: boolean;
}

interface QuizTimeProps {
  soundEnabled: boolean;
  onSaveQuizScore: (score: number, predicate: string) => void;
  onHome: () => void;
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizQuestions(): QuizQuestion[] {
  const orderedFruits = shuffleArray(FRUITS);
  const labels = ['A', 'B', 'C'];

  return orderedFruits.map((fruit, idx) => {
    const distractors = shuffleArray(FRUITS.filter((f) => f.id !== fruit.id)).slice(0, 2);
    const mode = idx % 3;

    if (mode === 0) {
      const choices = shuffleArray([fruit, ...distractors]);
      return {
        id: `q-${fruit.id}-${idx}`,
        fruit,
        prompt: 'What fruit is this?',
        subPrompt: 'Pilih nama buah Bahasa Inggris yang benar sesuai gambar.',
        options: choices.map((c, cIdx) => ({
          label: `${labels[cIdx]}. ${c.english}`,
          value: c.english
        })),
        correctValue: fruit.english
      };
    }

    if (mode === 1) {
      const choices = shuffleArray([fruit, ...distractors]);
      return {
        id: `q-${fruit.id}-${idx}`,
        fruit,
        prompt: `Apa arti "${fruit.english}" dalam Bahasa Indonesia?`,
        subPrompt: 'Lihat gambar buahnya dan pilih arti yang paling tepat.',
        options: choices.map((c, cIdx) => ({
          label: `${labels[cIdx]}. ${c.indonesian}`,
          value: c.indonesian
        })),
        correctValue: fruit.indonesian
      };
    }

    const choices = shuffleArray([fruit, ...distractors]);
    return {
      id: `q-${fruit.id}-${idx}`,
      fruit,
      prompt: 'Choose the correct sentence!',
      subPrompt: 'Pilih kalimat Bahasa Inggris yang sesuai dengan gambar buah.',
      options: choices.map((c, cIdx) => ({
        label: `${labels[cIdx]}. ${c.sentence}`,
        value: c.sentence
      })),
      correctValue: fruit.sentence
    };
  });
}

export function QuizTime({ soundEnabled, onSaveQuizScore, onHome }: QuizTimeProps) {
  const [quizSeed, setQuizSeed] = useState(0);
  const questions = useMemo(() => buildQuizQuestions(), [quizSeed]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const hasAnswered = selectedValue !== null;
  const isCorrect = selectedValue === currentQuestion?.correctValue;

  const handleChooseOption = (value: string) => {
    if (hasAnswered) return;
    setSelectedValue(value);

    const correct = value === currentQuestion.correctValue;
    if (correct) {
      playCorrectSound(soundEnabled);
    } else {
      playTryAgainSound(soundEnabled);
    }
  };

  const handleNext = () => {
    if (!selectedValue) return;
    playClickSound(soundEnabled);

    const record: QuizAnswerRecord = {
      question: currentQuestion,
      selectedValue,
      isCorrect: selectedValue === currentQuestion.correctValue
    };
    const updatedAnswers = [...answers, record];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 >= questions.length) {
      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      const finalScore = correctCount * 10;
      const predicate = getQuizPredicate(finalScore);
      onSaveQuizScore(finalScore, predicate.title);
      playVictorySound(soundEnabled);
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedValue(null);
    }
  };

  const handlePlayAgain = () => {
    playClickSound(soundEnabled);
    setQuizSeed((s) => s + 1);
    setCurrentIndex(0);
    setSelectedValue(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const finalScore = correctCount * 10;
    const predicate = getQuizPredicate(finalScore);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <StarCelebration
          title={predicate.title}
          subtitle={predicate.messageId}
          score={finalScore}
          maxScore={100}
          stars={predicate.stars}
          extraStats={[
            { label: 'Jawaban Benar', value: `${correctCount} / ${questions.length}` },
            { label: 'Predikat', value: predicate.title }
          ]}
          onPlayAgain={handlePlayAgain}
          onHome={onHome}
        />

        {/* Answer Review List */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">
            Ringkasan Jawaban Kuis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {answers.map((ans, idx) => (
              <div
                key={ans.question.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  ans.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0">
                  <FruitImage fruit={ans.question.fruit} className="w-full h-full rounded-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-500">
                    Soal {idx + 1} · {ans.question.fruit.english} ({ans.question.fruit.indonesian})
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    Jawabanmu: {ans.selectedValue}
                  </div>
                  {!ans.isCorrect && (
                    <div className="text-xs font-semibold text-emerald-700">
                      Jawaban benar: {ans.question.correctValue}
                    </div>
                  )}
                </div>
                {ans.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const runningCorrect = answers.filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Quiz Time!
          </h1>
          <p className="text-slate-600 text-base">
            Jawab 10 soal satu per satu dan kumpulkan skor tertinggimu!
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

      {/* Progress Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
        <div className="text-sm font-bold text-slate-800 tabular-nums">
          Soal {currentIndex + 1} dari {questions.length}
        </div>
        <div className="flex-1 max-w-xs h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <div className="text-sm font-bold text-emerald-700 tabular-nums">
          Skor: {runningCorrect * 10}
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Fruit Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[260px] aspect-square rounded-3xl border border-slate-200 bg-white p-4">
              <FruitImage fruit={currentQuestion.fruit} className="w-full h-full rounded-2xl" />
            </div>

            <button
              type="button"
              onClick={() => speakEnglish(currentQuestion.fruit.english, { soundEnabled })}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Dengar Petunjuk Suara
            </button>
          </div>

          {/* Question & 3 Options */}
          <div className="md:col-span-7">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {currentQuestion.prompt}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              {currentQuestion.subPrompt}
            </p>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedValue === opt.value;
                const isRightOption = opt.value === currentQuestion.correctValue;

                let btnStyle =
                  'bg-white hover:bg-slate-50 border-slate-300 text-slate-900';

                if (hasAnswered) {
                  if (isRightOption) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                  } else if (isSelected && !isRightOption) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleChooseOption(opt.value)}
                    className={`w-full min-h-[56px] px-5 py-3.5 rounded-2xl border-2 text-left font-display text-lg font-semibold flex items-center justify-between gap-3 transition-all ${
                      hasAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                    } ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {hasAnswered && isRightOption && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isRightOption && (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & NEXT button */}
            {hasAnswered && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div
                  className={`text-sm sm:text-base font-bold ${
                    isCorrect ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {isCorrect
                    ? 'EXCELLENT! YOU ARE RIGHT! (+10)'
                    : `Jawaban yang benar: ${currentQuestion.correctValue}`}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[50px] px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display text-lg font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{currentIndex + 1 >= questions.length ? 'LIHAT HASIL' : 'NEXT'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {!hasAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Ulangi Kuis dari Awal
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
