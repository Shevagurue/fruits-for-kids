import { GameId, StudentProgress } from '../types';

const STORAGE_KEY = 'lets_learn_fruits_progress_v1';

export const DEFAULT_PROGRESS: StudentProgress = {
  learnedFruitIds: [],
  spokenFruitIds: [],
  gameScores: {
    guess: { bestScore: 0, lastScore: 0, stars: 0, plays: 0 },
    matching: { bestScore: 0, lastScore: 0, stars: 0, plays: 0 },
    'listen-choose': { bestScore: 0, lastScore: 0, stars: 0, plays: 0 },
    memory: { bestScore: 0, lastScore: 0, stars: 0, plays: 0 },
    'what-fruit': { bestScore: 0, lastScore: 0, stars: 0, plays: 0 }
  },
  quiz: {
    bestScore: 0,
    lastScore: 0,
    lastPredicate: '',
    attempts: 0
  },
  soundEnabled: true
};

export function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    return {
      learnedFruitIds: Array.isArray(parsed.learnedFruitIds) ? parsed.learnedFruitIds : [],
      spokenFruitIds: Array.isArray(parsed.spokenFruitIds) ? parsed.spokenFruitIds : [],
      gameScores: {
        ...DEFAULT_PROGRESS.gameScores,
        ...(parsed.gameScores || {})
      },
      quiz: {
        ...DEFAULT_PROGRESS.quiz,
        ...(parsed.quiz || {})
      },
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors silently
  }
}

export function resetStoredProgress(): StudentProgress {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return DEFAULT_PROGRESS;
}

export function calculateStarsFromScore(score: number, maxScore = 100): number {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  if (pct >= 85) return 3;
  if (pct >= 60) return 2;
  if (pct > 0) return 1;
  return 0;
}

export function getQuizPredicate(score: number): {
  title: string;
  messageId: string;
  stars: number;
  tone: 'emerald' | 'amber' | 'sky' | 'rose';
} {
  if (score >= 90) {
    return {
      title: 'AMAZING!',
      messageId: 'Luar biasa! Kamu sudah sangat pintar mengenal buah dalam Bahasa Inggris!',
      stars: 3,
      tone: 'emerald'
    };
  }
  if (score >= 70) {
    return {
      title: 'GREAT JOB!',
      messageId: 'Hebat sekali! Hampir semua jawabanmu benar, terus berlatih ya!',
      stars: 3,
      tone: 'sky'
    };
  }
  if (score >= 50) {
    return {
      title: 'GOOD TRY!',
      messageId: 'Bagus! Kamu sudah berani mencoba. Yuk ulangi belajar agar makin hebat!',
      stars: 2,
      tone: 'amber'
    };
  }
  return {
    title: 'KEEP PRACTICING!',
    messageId: 'Tetap semangat ya! Ayo buka menu Let’s Learn dulu lalu coba kuis lagi!',
    stars: 1,
    tone: 'rose'
  };
}

export function updateGameScoreRecord(
  current: StudentProgress,
  gameId: GameId,
  score: number
): StudentProgress {
  const prev = current.gameScores[gameId];
  const stars = calculateStarsFromScore(score, 100);
  const next: StudentProgress = {
    ...current,
    gameScores: {
      ...current.gameScores,
      [gameId]: {
        bestScore: Math.max(prev.bestScore, score),
        lastScore: score,
        stars: Math.max(prev.stars, stars),
        plays: prev.plays + 1
      }
    }
  };
  saveProgress(next);
  return next;
}
