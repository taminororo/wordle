'use client';

// 1. useMemo を React からインポート
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import WORD_LIST from '../data/combined_word_list.json';
import AlphabetButton from './AlphabetButtons';
import ResultModal from './ResultModal'; 

// ...（他の定義は変更なし）
const NUMBER_OF_LETTERS_PER_GUESS = 5;
const NUMBER_OF_GUESS_ROWS = 5;


const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex].originalWord.toUpperCase();

}

interface WordleProps {
  onYellowLettersChange: (letters: string[]) => void;
  onGreenLettersChange: (letters: {char: string, index: number}[]) => void;
  streakCount: number; // ★ 親からstreakCountを受け取る
  onGameEnd: (isSuccess: boolean) => void; // ★ ゲーム終了を親に通知する
}


export default function Wordle({ onYellowLettersChange, onGreenLettersChange, streakCount, onGameEnd }: WordleProps) {
  // ...（Stateの定義は変更なし）
  const [guesses, setGuesses] = useState<string[]>(Array(NUMBER_OF_GUESS_ROWS).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);



  // --- ★追加: ダイアログの状態を管理
  const [dialog, setDialog] = useState({ isOpen: false, message: '' });

  // --- ★追加: 連続正解数とゲーム状態を管理
  const [winStreak, setWinStreak] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // --- ★追加: キーボードの各キーの色を管理するState


  const [keyStates, setKeyStates] = useState<{[key: string]: string}>({});
  const [flipStates, setFlipStates] = useState<boolean[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false))
  );

  const [targetWord, setTargetWord] = useState(getRandomWord());

  const [evaluationStates, setEvaluationStates] = useState<string[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''))
  );


  // 2. パフォーマンス向上のため、検索用の単語セットを最初に一度だけ作成
  const validWordSet = useMemo(() => {
    return new Set(WORD_LIST.map(item => item.originalWord.toLowerCase()));
  }, []);


  const handleButtonClick = useCallback((buttonLabel: string) => {
    if (!targetWord || isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) return;

    const currentLettersCount = currentGuess.filter(char => char !== '').length;
    if (currentLettersCount >= NUMBER_OF_LETTERS_PER_GUESS && buttonLabel !== 'Backspace') return;

    if (buttonLabel === 'Backspace') {
      setCurrentGuess(prev => {
        const newGuess = [...prev];
        for (let i = newGuess.length - 1; i >= 0; i--) if (newGuess[i] !== '') { newGuess[i] = ''; break; }
        return newGuess;
      });
    } else {
      setCurrentGuess(prev => {
        const newGuess = [...prev];
        for (let i = 0; i < newGuess.length; i++) if (newGuess[i] === '') { newGuess[i] = buttonLabel; break; }
        return newGuess;
      });
    }
    setGameMessage('');
  }, [currentGuess, isGameOver, currentRowIndex, targetWord]);

  const handleEnterClick = useCallback(() => {
    if (isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) return;
    const currentGuessString = currentGuess.filter(char => char !== '').join('');
    if (currentGuessString.length !== NUMBER_OF_LETTERS_PER_GUESS) {
      setGameMessage(`${NUMBER_OF_LETTERS_PER_GUESS}文字入力してください！`);
      return;
    }
    if (!validWordSet.has(currentGuessString.toLowerCase())) {
      setGameMessage('その単語はリストにありません');
      return;
    }
    
    const guessUpper = currentGuess.map(c => c.toUpperCase());
    const targetUpper = targetWord.toUpperCase();
    const newEvaluation = Array(NUMBER_OF_LETTERS_PER_GUESS).fill('');
    const targetLetterPool = targetUpper.split('');
    guessUpper.forEach((char, index) => {
      if (char === targetUpper[index]) {
        newEvaluation[index] = 'bg-green-700';
        targetLetterPool[index] = '';
      }
    });
    guessUpper.forEach((char, index) => {
      if (newEvaluation[index] === 'bg-green-700') return;
      const yellowIndex = targetLetterPool.indexOf(char);
      if (yellowIndex !== -1) {
        newEvaluation[index] = 'bg-yellow-500';
        targetLetterPool[yellowIndex] = '';
      } else {
        newEvaluation[index] = 'bg-gray-700';
      }
    });
    setEvaluationStates(prev => {
      const newStates = [...prev];
      newStates[currentRowIndex] = newEvaluation;
      return newStates;
    });
    for (let i = 0; i < NUMBER_OF_LETTERS_PER_GUESS; i++) {
      setTimeout(() => setFlipStates(prev => {
        const newStates = [...prev];
        if (newStates[currentRowIndex]) newStates[currentRowIndex][i] = true;
        return newStates;
      }), i * 150);
    }
    const totalAnimationTime = (NUMBER_OF_LETTERS_PER_GUESS - 1) * 150 + 600;
    setTimeout(() => {
      const newKeyStates = { ...keyStates };
      newEvaluation.forEach((color, index) => {
        const char = currentGuess[index].toUpperCase();
        const currentColor = newKeyStates[char];
        if (currentColor !== 'bg-green-700') {
          if (color === 'bg-green-700' || (color === 'bg-yellow-500' && currentColor !== 'bg-yellow-500')) {
            newKeyStates[char] = color;
          } else if (!currentColor) {
            newKeyStates[char] = color;
          }
        }
      });
      setKeyStates(newKeyStates);
      const yellowChars = newEvaluation.map((color, index) => color === 'bg-yellow-500' ? currentGuess[index].toUpperCase() : null).filter((char): char is string => char !== null);
      onYellowLettersChange(yellowChars);
      const greenChars = newEvaluation.map((color, index) => color === 'bg-green-700' ? { char: currentGuess[index].toUpperCase(), index } : null).filter((item): item is {char: string, index: number} => item !== null);
      onGreenLettersChange(greenChars);
      if (currentGuessString.toUpperCase() === targetWord.toUpperCase()) {
        setIsSuccess(true);
        setIsGameOver(true);
        onGameEnd(true); // ★ 親に成功を通知
      } else if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {
        setIsSuccess(false);
        setIsGameOver(true);
        onGameEnd(false); // ★ 親に失敗を通知
      }
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[currentRowIndex] = currentGuessString;
        return newGuesses;
      });
      setCurrentRowIndex(prev => prev + 1);
      setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
    }, totalAnimationTime);

  }, [currentGuess, currentRowIndex, isGameOver, keyStates, onGreenLettersChange, onYellowLettersChange, targetWord, validWordSet]);

  const handleResetClick = () => {
    setGuesses(Array(NUMBER_OF_GUESS_ROWS).fill(''));
    setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
    setCurrentRowIndex(0);
    setGameMessage('');
    setIsGameOver(false);
    setIsSuccess(false); // ★リセット
    setKeyStates({});
    onYellowLettersChange([]);
    onGreenLettersChange([]);

    setFlipStates(Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false)));
    setEvaluationStates(Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill('')));
    setTargetWord(getRandomWord());
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver) return;

      if (event.key === 'Enter') {
        handleEnterClick();
      } else if (event.key === 'Backspace') {
        handleButtonClick('Backspace');
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleButtonClick(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleButtonClick, handleEnterClick, isGameOver]);

  return (
    <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
      {/* ★ ヘッダー部分をFlexboxでレイアウト */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">5文字を当てようゲーム</h2>
        <div className="text-lg font-semibold">
          <span role="img" aria-label="fire">🔥</span> 連続正解: {streakCount}
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {Array.from({ length: NUMBER_OF_GUESS_ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3">
            {(rowIndex < currentRowIndex ? guesses[rowIndex].split('') : rowIndex === currentRowIndex ? currentGuess : Array(NUMBER_OF_LETTERS_PER_GUESS).fill('')).map((char, charIndex) => {
              let tileStateClass = '';
              if (rowIndex < currentRowIndex) tileStateClass = evaluationStates[rowIndex][charIndex];
              else if (rowIndex === currentRowIndex && char !== '') tileStateClass = 'bg-blue-700';
              else tileStateClass = 'bg-gray-700';
              const commonTileClasses = "border border-blue-500 p-4 min-h-16 w-16 rounded-md flex items-center justify-center text-xl font-bold break-words";
              return (
                <div key={charIndex} className={`flip-card ${flipStates[rowIndex][charIndex] ? 'flipped' : ''}`}>
                  <div className="flip-card-inner">
                    <div className={`flip-card-front ${commonTileClasses} ${tileStateClass} ${rowIndex === currentRowIndex && charIndex === currentGuess.filter(c => c !== '').length && 'border-white'}`}>{char}</div>
                    <div className={`flip-card-back ${commonTileClasses} ${evaluationStates[rowIndex][charIndex]}`}>{char}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {gameMessage && <div className="mt-4 p-3 bg-yellow-500 text-black rounded-md font-bold text-lg">{gameMessage}</div>}
      <div className="flex justify-center gap-4 mt-5 mb-8">
        <AlphabetButton label="Enter" onButtonClick={handleEnterClick} disabled={true} />
        <AlphabetButton label="Reset" onButtonClick={handleResetClick} />
        <AlphabetButton label="Backspace" onButtonClick={() => handleButtonClick('Backspace')} disabled={true} />
      </div>
      <div className="flex justify-center flex-col items-center space-y-2">
        <div className="flex justify-center gap-2 flex-wrap">{'QWERTYUIOP'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} disabled={true} />))}</div>
        <div className="flex justify-center gap-2 flex-wrap">{'ASDFGHJKL'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} disabled={true} />))}</div>
        <div className="flex justify-center gap-2 flex-wrap">{'ZXCVBNM'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} disabled={true} />))}</div>
      </div>



