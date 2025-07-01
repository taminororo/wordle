'use client'; // クライアントサイドでの実行を明示

import { useState } from 'react'; // ★useStateをインポート
import Wordle from '../components/Wordle';
import BackgroundCascade from '../components/BackgroundCasacde';

export default function MyApp() {
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  // ★追加: 緑判定された文字と位置を管理するState
  const [greenLetters, setGreenLetters] = useState<{char: string, index: number}[]>([]);

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

  // ★追加: 緑文字を蓄積して更新するハンドラ
  const handleGreenLettersChange = (newLetters: {char: string, index: number}[]) => {
    if (newLetters.length === 0) {
      setGreenLetters([]);
      return;
    }
    setGreenLetters(prevLetters => {
      const combined = [...prevLetters];
      newLetters.forEach(newLetter => {
        // 同じ位置の文字が既に存在しないか確認
        if (!combined.some(prev => prev.index === newLetter.index)) {
          combined.push(newLetter);
        }
      });
      return combined;
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* ★修正: greenLettersもプロパティとして渡す */}
      <BackgroundCascade yellowLetters={yellowLetters} greenLetters={greenLetters} />

      <div className="container mx-auto mt-8 relative z-10">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Wordle</h2>
          <div className="font-sans text-center p-5">
            <h1 className="text-3xl font-bold mb-8">wordle</h1>
            {/* ★修正: 新しいハンドラも渡す */}
            <Wordle 
              onYellowLettersChange={handleYellowLettersChange} 
              onGreenLettersChange={handleGreenLettersChange} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}