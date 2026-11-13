/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { LetsLearn } from './components/LetsLearn';
import { LetsPlayHub } from './components/LetsPlayHub';
import { ListenAndRepeat } from './components/ListenAndRepeat';
import { MainMenu } from './components/MainMenu';
import { MyScore } from './components/MyScore';
import { OpeningScreen } from './components/OpeningScreen';
import { QuizTime } from './components/QuizTime';
import { TopBar } from './components/TopBar';
import { GameId, ScreenId, StudentProgress } from './types';
import { initVoices, playClickSound, stopSpeaking } from './utils/audio';
import {
  loadProgress,
  resetStoredProgress,
  saveProgress,
  updateGameScoreRecord
} from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('opening');
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  useEffect(() => {
    initVoices();
    return () => stopSpeaking();
  }, []);

  const handleNavigate = (next: ScreenId) => {
    stopSpeaking();
    playClickSound(progress.soundEnabled);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const nextSound = !progress.soundEnabled;
    if (!nextSound) {
      stopSpeaking();
    } else {
      playClickSound(true);
    }
    const updated: StudentProgress = {
      ...progress,
      soundEnabled: nextSound
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleEnableSound = () => {
    if (progress.soundEnabled) return;
    playClickSound(true);
    const updated: StudentProgress = {
      ...progress,
      soundEnabled: true
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleMarkLearned = (fruitId: string) => {
    if (progress.learnedFruitIds.includes(fruitId)) return;
    const updated: StudentProgress = {
      ...progress,
      learnedFruitIds: [...progress.learnedFruitIds, fruitId]
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleMarkSpoken = (fruitId: string) => {
    const nextLearned = progress.learnedFruitIds.includes(fruitId)
      ? progress.learnedFruitIds
      : [...progress.learnedFruitIds, fruitId];
    const nextSpoken = progress.spokenFruitIds.includes(fruitId)
      ? progress.spokenFruitIds
      : [...progress.spokenFruitIds, fruitId];

    const updated: StudentProgress = {
      ...progress,
      learnedFruitIds: nextLearned,
      spokenFruitIds: nextSpoken
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleSaveGameScore = (gameId: GameId, score: number) => {
    setProgress((prev) => updateGameScoreRecord(prev, gameId, score));
  };

  const handleSaveQuizScore = (score: number, predicate: string) => {
    setProgress((prev) => {
      const updated: StudentProgress = {
        ...prev,
        quiz: {
          bestScore: Math.max(prev.quiz.bestScore, score),
          lastScore: score,
          lastPredicate: predicate,
          attempts: prev.quiz.attempts + 1
        }
      };
      saveProgress(updated);
      return updated;
    });
  };

  const handleResetProgress = () => {
    const fresh = resetStoredProgress();
    const preservedSound: StudentProgress = {
      ...fresh,
      soundEnabled: progress.soundEnabled
    };
    setProgress(preservedSound);
    saveProgress(preservedSound);
  };

  if (screen === 'opening') {
    return (
      <OpeningScreen
        soundEnabled={progress.soundEnabled}
        onStart={() => handleNavigate('menu')}
        onToggleSound={handleToggleSound}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      <TopBar
        currentScreen={screen}
        soundEnabled={progress.soundEnabled}
        onNavigate={handleNavigate}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 pb-12">
        {screen === 'menu' && (
          <MainMenu progress={progress} onSelectScreen={handleNavigate} />
        )}

        {screen === 'learn' && (
          <LetsLearn
            soundEnabled={progress.soundEnabled}
            learnedFruitIds={progress.learnedFruitIds}
            onMarkLearned={handleMarkLearned}
            onHome={() => handleNavigate('menu')}
            onEnableSound={handleEnableSound}
          />
        )}

        {screen === 'listen' && (
          <ListenAndRepeat
            soundEnabled={progress.soundEnabled}
            spokenFruitIds={progress.spokenFruitIds}
            onMarkSpoken={handleMarkSpoken}
            onHome={() => handleNavigate('menu')}
          />
        )}

        {screen === 'play' && (
          <LetsPlayHub
            soundEnabled={progress.soundEnabled}
            progress={progress}
            onSaveGameScore={handleSaveGameScore}
            onHome={() => handleNavigate('menu')}
          />
        )}

        {screen === 'quiz' && (
          <QuizTime
            soundEnabled={progress.soundEnabled}
            onSaveQuizScore={handleSaveQuizScore}
            onHome={() => handleNavigate('menu')}
          />
        )}

        {screen === 'score' && (
          <MyScore
            progress={progress}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>
    </div>
  );
}
