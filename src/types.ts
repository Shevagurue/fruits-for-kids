export type ScreenId =
  | 'opening'
  | 'menu'
  | 'learn'
  | 'listen'
  | 'play'
  | 'quiz'
  | 'score';

export type GameId =
  | 'guess'
  | 'matching'
  | 'listen-choose'
  | 'memory'
  | 'what-fruit';

export interface FruitItem {
  id: string;
  english: string;
  indonesian: string;
  pronunciation: string;
  sentence: string;
  image: string;
  accentHex: string;
  surfaceTint: string;
  borderTint: string;
  funFactId: string;
}

export interface GameScoreRecord {
  bestScore: number;
  lastScore: number;
  stars: number;
  plays: number;
}

export interface QuizRecord {
  bestScore: number;
  lastScore: number;
  lastPredicate: string;
  attempts: number;
}

export interface StudentProgress {
  learnedFruitIds: string[];
  spokenFruitIds: string[];
  gameScores: Record<GameId, GameScoreRecord>;
  quiz: QuizRecord;
  soundEnabled: boolean;
}
