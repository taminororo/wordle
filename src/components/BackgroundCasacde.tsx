'use client';

import React, { useState, useEffect, useRef } from 'react';
// AlphabetButton はこのコンポーネントでは使わないので削除
import { WORD_LIST } from '@/utils/words'; // パスはプロジェクトに合わせて適宜変更してください

// BackgroundCascade.tsx (抜粋)

interface CascadingWordData {
  id: number;
  word: string;
  duration: number;
  delay: number;
  x: string;
}

// Wordleゲームのルールとは独立した定義
const NUMBER_OF_LETTERS_PER_GUESS = 5; // 背景に流す単語の文字数も指定できるようにする

export default function BackgroundCascade() {
  // コンポーネント内部でHooksを宣言
  const [cascadingWords, setCascadingWords] = useState<CascadingWordData[]>([]);
  const nextCascadeWordId = useRef(0);

  // 単語を生成してリストに追加する関数
  const addCascadingWord = () => {
    // 5文字の単語のみを選択する場合
    const fiveLetterWords = WORD_LIST.filter(word => word.length === NUMBER_OF_LETTERS_PER_GUESS);
    if (fiveLetterWords.length === 0) return;

    const randomWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    const duration = Math.random() * 5 + 5; // 5秒から10秒の間でランダム
    const delay = Math.random() * 2; // 0秒から2秒の間でランダムな遅延
    const startX = Math.random() * 100; // 0%から100%の間でランダムな横開始位置

    setCascadingWords(prev => [
      ...prev,
      {
        id: nextCascadeWordId.current++,
        word: randomWord,
        duration: duration,
        delay: delay,
        x: `${startX}%`,
      },
    ]);

    // アニメーション完了後にリストから削除する（メモリリーク防止）
    // setTimeout の第二引数に delay を含めることで、アニメーション開始からの総時間を計算
    setTimeout(() => {
      setCascadingWords(prev => prev.filter(w => w.id !== nextCascadeWordId.current - 1));
    }, (duration + delay) * 1000); // 秒をミリ秒に変換
  };

  // コンポーネントマウント時に定期的に単語を生成
  useEffect(() => {
    // 初期単語をいくつか表示したい場合は、ここで何度か addCascadingWord() を呼び出す
    // for (let i = 0; i < 5; i++) {
    //   addCascadingWord(); // 初期表示数を調整
    // }

    const interval = setInterval(addCascadingWord, 1000); // 1秒ごとに新しい単語を生成
    return () => clearInterval(interval); // コンポーネントがアンマウントされたときにタイマーをクリーンアップ
  }, []); // 空の依存配列なので、初回マウント時のみ実行

  return (
    // 絶対配置で画面全体を覆い、他のコンテンツの背後に来るようにする
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {cascadingWords.map(wordData => (
        <div
          key={wordData.id}
          className="cascading-word" // global.cssで定義したスタイルが適用される
          style={{
            left: wordData.x,
            animationDuration: `${wordData.duration}s`,
            animationDelay: `${wordData.delay}s`,
            // 必要に応じて、色をさらにランダム化したり、特定のCSS変数を設定したりできます
            // 例: 
            color: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.1)`,
          }}
        >
          {wordData.word}
        </div>
      ))}
    </div>
  );
}