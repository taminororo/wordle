'use client';

import React, { useState, useEffect, useRef } from 'react';
// 1. 'with { type: 'json' }' を削除
import WORD_LIST from '../data/combined_word_list.json';
//import translations from '../data/translated_words.json'; // ★日本語訳をインポート

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
  greenLetters: {char: string, index: number}[];
  streakCount: number; // ★ streakCount をプロパティとして追加
}

// ★ 型のエイリアスを定義
//type Translations = { [key: string]: string };

const NUMBER_OF_LETTERS_PER_GUESS = 5;

export default function BackgroundCascade({ yellowLetters, greenLetters, streakCount }: BackgroundCascadeProps) {
  const [cascadingWords, setCascadingWords] = useState<CascadingWordData[]>([]);
  const nextCascadeWordId = useRef(0);

  const addCascadingWord = () => {

    // 2. データ構造に合わせてフィルタリング ('word' -> 'word.originalWord')
    let wordPool = WORD_LIST.filter(wordObj => wordObj.originalWord.length === NUMBER_OF_LETTERS_PER_GUESS);


    if (greenLetters.length > 0) {
      wordPool = wordPool.filter(wordObj => 

        greenLetters.every(green => wordObj.originalWord[green.index].toLowerCase() === green.char.toLowerCase())

      );
    }

    if (yellowLetters.length > 0) {
      const yellowLettersLower = yellowLetters.map(l => l.toLowerCase());
      wordPool = wordPool.filter(wordObj => 
        yellowLettersLower.every(yellowChar => wordObj.originalWord.includes(yellowChar))

      );
    }

    if (wordPool.length === 0) return;


    const randomWordObject = wordPool[Math.floor(Math.random() * wordPool.length)];
    let displayWord = randomWordObject.originalWord;

    // ★★★ ここからが修正の核となるロジック ★★★
    // streakCountに応じて表示する単語を決定
    if (streakCount >= 5) { // 5連勝以上で全て日本語
      displayWord = randomWordObject.translatedWord;
    } else if (streakCount >= 2) { // 2連勝以上で50%の確率で日本語
      if (Math.random() < 0.5) {
        displayWord = randomWordObject.translatedWord;
      }
    }
    // ★★★ ここまで ★★★

    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * 0;
    const startX = Math.random() * 100;

    const currentWordId = nextCascadeWordId.current++; 

    setCascadingWords(prev => [
      ...prev,
      {
        id: currentWordId,
        word: displayWord, // ★ 表示する単語をセット
        duration: duration,
        delay: delay,
        x: `${startX}%`,
      },
    ]);

    setTimeout(() => {
      setCascadingWords(prev => prev.filter(w => w.id !== currentWordId));
    }, (duration + delay) * 1000 + 500);
  };

  useEffect(() => {
    const interval = setInterval(addCascadingWord, 1000);
    return () => clearInterval(interval);
  }, [yellowLetters, greenLetters, streakCount]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {cascadingWords.map(wordData => (
        <div
          key={wordData.id}
          className="cascading-word"
          style={{
            left: wordData.x,
            animationDuration: `${wordData.duration}s`,
            animationDelay: `${wordData.delay}s`,
          }}
        >
          {wordData.word}
        </div>
      ))}
    </div>
  );
}