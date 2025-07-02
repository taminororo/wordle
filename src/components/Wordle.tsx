'use client';

import React, { useState } from 'react';
// 1. 英語と日本語がペアになった combined_word_list.json のみインポートする
import WORD_LIST from '../data/combined_word_list.json';
// import translations from '../data/translated_words.json'; // ← 不要なので削除
import AlphabetButton from './AlphabetButtons';
import ResultModal from './ResultModal';

// 定義はそのまま
const NUMBER_OF_LETTERS_PER_GUESS = 5;
const NUMBER_OF_GUESS_ROWS = 5;


const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex].originalWord.toUpperCase();

}

// 型のエイリアスは不要なので削除
// type Translations = { [key: string]: string };

interface WordleProps {
  onYellowLettersChange: (letters: string[]) => void;
  onGreenLettersChange: (letters: {char: string, index: number}[]) => void;
}

export default function Wordle({ onYellowLettersChange, onGreenLettersChange }: WordleProps) {
  // Stateの定義はそのまま...
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

  // handleButtonClick, handleEnterClick, handleResetClick の中身は変更なし...
// Wordle.tsx

  const handleEnterClick = () => {
    if (isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) {
      setGameMessage('ゲームは終了しました。Resetを押してください。');
      return;
    }

    const currentGuessString = currentGuess.filter(char => char !== '').join('');

    if (currentGuessString.length !== NUMBER_OF_LETTERS_PER_GUESS) {
      setGameMessage(`${NUMBER_OF_LETTERS_PER_GUESS}文字入力してください！`);
      return;
    }

    // --- ▼▼ ここから色判定ロジックを修正 ▼▼ ---

    const guessUpper = currentGuess.map(c => c.toUpperCase());
    const targetUpper = targetWord.toUpperCase();
    const newEvaluation = Array(NUMBER_OF_LETTERS_PER_GUESS).fill('');
    
    // 判定に使うため、正解の単語の文字を一時的な配列に入れる
    const targetLetterPool = targetUpper.split('');

    // 【ステップ1】まず「緑」の判定を先に行う
    guessUpper.forEach((char, index) => {
      if (char === targetUpper[index]) {
        newEvaluation[index] = 'bg-green-700'; // 緑に設定
        targetLetterPool[index] = ''; // マッチした文字をプールから消費する
      }
    });

    // 【ステップ2】次に「黄色」と「灰色」を判定する
    guessUpper.forEach((char, index) => {
      // 既に緑の場合はスキップ
      if (newEvaluation[index] === 'bg-green-700') {
        return;
      }

      // プールに文字が存在するかチェック
      const yellowIndex = targetLetterPool.indexOf(char);
      if (yellowIndex !== -1) {
        newEvaluation[index] = 'bg-yellow-500'; // 黄色に設定
        targetLetterPool[yellowIndex] = ''; // マッチした文字をプールから消費する
      } else {
        newEvaluation[index] = 'bg-gray-700'; // 灰色に設定
      }
    });

    // --- ▲▲ 色判定ロジックの修正ここまで ▲▲ ---


    // 判定後のState更新処理は変更なし
    setEvaluationStates(prev => {
      const newStates = [...prev];
      newStates[currentRowIndex] = newEvaluation;
      return newStates;
    });

    for (let i = 0; i < NUMBER_OF_LETTERS_PER_GUESS; i++) {
      setTimeout(() => {
        setFlipStates(prev => {
          const newFlipStates = [...prev];
          if (newFlipStates[currentRowIndex]) {
            newFlipStates[currentRowIndex][i] = true;
          }
          return newFlipStates;
        });
      }, i * 150);
    }

    const totalAnimationTime = (NUMBER_OF_LETTERS_PER_GUESS - 1) * 150 + 600;

    setTimeout(() => {
      // ...この後のキーボードの色更新やゲーム終了判定のロジックは変更ありません...
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

      const yellowChars = newEvaluation.map((color, index) => {
        if (color === 'bg-yellow-500') {
          return currentGuess[index].toUpperCase();
        }
        return null;
      }).filter((char): char is string => char !== null);
      onYellowLettersChange(yellowChars);

      const greenChars = newEvaluation.map((color, index) => {
        if (color === 'bg-green-700') {
          return { char: currentGuess[index].toUpperCase(), index };
        }
        return null;
      }).filter((item): item is {char: string, index: number} => item !== null);
      onGreenLettersChange(greenChars);

      if (currentGuessString.toUpperCase() === targetWord.toUpperCase()) {
        setIsSuccess(true);

        setIsGameOver(true);
      } else if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {
        setIsSuccess(false);
        setIsGameOver(true);
      }

      setGuesses(prevGuesses => {
        const newGuesses = [...prevGuesses];
        newGuesses[currentRowIndex] = currentGuessString;
        return newGuesses;
      });
      setCurrentRowIndex(prevIndex => prevIndex + 1);
      setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
    }, totalAnimationTime);
  };
  const handleButtonClick = (buttonLabel: string) => {
    // ...関数の内容は変更なし
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

  };
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

  // 2. このヘルパー関数は不要なので削除
  /*
  const getTranslatedWord = (word: string): string => {
    return translations[word.toLowerCase()] || '翻訳が見つかりません';
    return (translations as Translations)[word.toLowerCase()] || '翻訳が見つかりません';
  };
  */

  return (
    <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
      <h2 className="text-2xl font-bold mb-4">5文字を当てようゲーム</h2>

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
      
      {/* ボタン部分も変更なし */}
      <div className="flex justify-center gap-4 mt-5 mb-8">
        <AlphabetButton label="Enter" onButtonClick={handleEnterClick} />
        <AlphabetButton label="Reset" onButtonClick={handleResetClick} />
        <AlphabetButton label="Backspace" onButtonClick={() => handleButtonClick('Backspace')} />
      </div>
      <div className="flex justify-center flex-col items-center space-y-2">
        <div className="flex justify-center gap-2 flex-wrap">{'QWERTYUIOP'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />))}</div>
        <div className="flex justify-center gap-2 flex-wrap">{'ASDFGHJKL'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />))}</div>
        <div className="flex justify-center gap-2 flex-wrap">{'ZXCVBNM'.split('').map(label => (<AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />))}</div>
      </div>


      {isGameOver && (
        <ResultModal
          isSuccess={isSuccess}
          targetWord={targetWord}
          // 3. WORD_LISTから直接翻訳を探すように変更
          translatedWord={
            WORD_LIST.find(item => item.originalWord.toUpperCase() === targetWord)?.translatedWord || '翻訳が見つかりません'
          }
          onReset={handleResetClick}
        />

      )}
    </div>
  );
}