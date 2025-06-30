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

interface BackgroundCascadeProps {
  yellowLetters: string[];
}

// Wordleゲームのルールとは独立した定義
const NUMBER_OF_LETTERS_PER_GUESS = 5; // 背景に流す単語の文字数も指定できるようにする

export default function BackgroundCascade({ yellowLetters }: BackgroundCascadeProps) {
  // コンポーネント内部でHooksを宣言
  const [cascadingWords, setCascadingWords] = useState<CascadingWordData[]>([]);
  const nextCascadeWordId = useRef(0); // IDの初期値を1000に設定（適宜変更可能）

  // 単語を生成してリストに追加する関数
  const addCascadingWord = () => {
    // ★変更: 黄色文字リストに基づいて単語プールをフィルタリング
    let wordPool = WORD_LIST.filter(word => word.length === NUMBER_OF_LETTERS_PER_GUESS);

    if (yellowLetters.length > 0) {
      const yellowLettersLower = yellowLetters.map(l => l.toLowerCase());
      wordPool = wordPool.filter(word => 
        yellowLettersLower.every(yellowChar => word.includes(yellowChar))
      );
    }

    if (wordPool.length === 0) return; // 該当する単語がなければ何もしない

    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    const duration = Math.random() * 5 + 5; // 5秒から10秒の間でランダム
    //onst duration = 10; // 3秒から5秒の間でランダム
    const delay = Math.random() * 0; // 0秒から2秒の間でランダムな遅延
    const startX = Math.random() * 100; // 0%から100%の間でランダムな横開始位置
    // ★修正点1: 現在の単語のIDをローカル変数に保存
    const currentWordId = nextCascadeWordId.current++; 

    setCascadingWords(prev => [
      ...prev,
      {
        id: currentWordId, // ★修正点2: 保存したIDを使用
        word: randomWord,
        duration: duration,
        delay: delay,
        x: `${startX}%`,
      },
    ]);

    // アニメーション完了後にリストから削除する
    setTimeout(() => {
      // ★修正点3: 保存したIDを使用
      setCascadingWords(prev => prev.filter(w => w.id !== currentWordId));
    }, (duration + delay) * 1000 + 500); // 0.5秒のマージンを追加（必要に応じて調整）
  };

  // コンポーネントマウント時に定期的に単語を生成
  useEffect(() => {
    // //初期単語をいくつか表示したい場合は、ここで何度か addCascadingWord() を呼び出す
    // for (let i = 0; i < 10; i++) {
    //   addCascadingWord(); // 初期表示数を調整
    // }

    const interval = setInterval(addCascadingWord, 1000); // 1秒ごとに新しい単語を生成
    return () => clearInterval(interval); // コンポーネントがアンマウントされたときにタイマーをクリーンアップ
  }, [yellowLetters]); // ★修正: yellowLettersが変更されたらエフェクトを再実行する

  // BackgroundCascade.tsx (修正案)

return (
  // 'overflow-hidden' を削除
  <div className="absolute inset-0 pointer-events-none z-0">
    {cascadingWords.map(wordData => (
      <div
        key={wordData.id}
        className="cascading-word"
        style={{
          left: wordData.x,
          animationDuration: `${wordData.duration}s`,
          animationDelay: `${wordData.delay}s`,
          // 必要に応じて、色をさらにランダム化したり、特定のCSS変数を設定したりできます
          // color: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`,
        }}
      >
        {wordData.word}
      </div>
    ))}
  </div>
);
}