'use client'; // クライアントサイドでの実行を明示

import { useState } from 'react'; // ★useStateをインポート
import Wordle from '../components/Wordle';
import BackgroundCascade from '../components/BackgroundCasacde';

export default function MyApp() {
  // ★変更: 黄色判定された文字のリストを管理するState（変更なし）
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);

  // ★追加: 黄色文字を蓄積して更新するハンドラ
  const handleYellowLettersChange = (newLetters: string[]) => {
    if (newLetters.length === 0) {
      // リセットの場合
      setYellowLetters([]);
      return;
    }
    // 新しい文字を既存のリストと結合し、重複を削除
    setYellowLetters(prevLetters => {
      const combined = new Set([...prevLetters, ...newLetters]);
      return Array.from(combined);
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* yellowLettersをプロパティとして渡す（変更なし） */}
      <BackgroundCascade yellowLetters={yellowLetters} />

      <div className="container mx-auto mt-8 relative z-10">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Wordle</h2>
          <div className="font-sans text-center p-5">
            <h1 className="text-3xl font-bold mb-8">wordle</h1>
            {/* ★修正: 新しいハンドラを渡す */}
            <Wordle onYellowLettersChange={handleYellowLettersChange} />
          </div>
        </section>
      </div>
    </div>
  );
}