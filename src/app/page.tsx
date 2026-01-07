'use client'; // クライアントサイドでの実行を明示

import { useState } from 'react'; // ★useStateをインポート
import { useEffect } from 'react'; // ★useEffectをインポート
import Wordle from '../components/game/GameBoard';
import BackgroundCascade from '@/components/game/BackgroundCasacde';

export default function MyApp() {
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [greenLetters, setGreenLetters] = useState<{char: string, index: number}[]>([]);
  const [streakCount, setStreakCount] = useState(0);

  // ★ LocalStorageから初回読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('wordle-streak');
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }
    }
  }, []);

  const handleYellowLettersChange = (newLetters: string[]) => {
    if (newLetters.length === 0) {
      setYellowLetters([]);
      return;
    }
    setYellowLetters(prevLetters => {
      const combined = new Set([...prevLetters, ...newLetters]);
      return Array.from(combined);
    });
  };

  const handleGreenLettersChange = (newLetters: {char: string, index: number}[]) => {
    if (newLetters.length === 0) {
      setGreenLetters([]);
      return;
    }
    setGreenLetters(prevLetters => {
      const combined = [...prevLetters];
      newLetters.forEach(newLetter => {
        if (!combined.some(prev => prev.index === newLetter.index)) {
          combined.push(newLetter);
        }
      });
      return combined;
    });
  };

  // ★ ゲーム終了時にWordleから呼ばれるハンドラ
  const handleGameEnd = (isSuccess: boolean) => {
    const newStreak = isSuccess ? streakCount + 1 : 0;
    setStreakCount(newStreak);
    // ★ LocalStorageに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordle-streak', newStreak.toString());
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* ★ streakCount を BackgroundCascade に渡す */}
      <BackgroundCascade yellowLetters={yellowLetters} greenLetters={greenLetters} streakCount={streakCount} />

      <div className="container mx-auto mt-8 relative z-10">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Wordle?</h2>
          <div className="font-sans text-center p-5">
            <h1 className="text-3xl font-bold mb-8">Wordle?</h1>
            {/* ★ streakCountとonGameEndを渡す */}
            <Wordle 
              onYellowLettersChange={handleYellowLettersChange} 
              onGreenLettersChange={handleGreenLettersChange} 
              streakCount={streakCount}
              onGameEnd={handleGameEnd}
            />
          </div>
        </section>
      </div>
    </div>
  );
}