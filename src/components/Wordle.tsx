'use client';

import React, { useState } from 'react';
import WORD_LIST from '../data/combined_word_list.json';
import translations from '../data/translated_words.json';
import AlphabetButton from './AlphabetButtons';
import ResultModal from './ResultModal'; // ★インポートを追加

// 定義はそのまま
const NUMBER_OF_LETTERS_PER_GUESS = 5;
const NUMBER_OF_GUESS_ROWS = 5;
<<<<<<< HEAD
// --- ★追加: ターゲットワードをランダムに選ぶ
const getRandomWord = (): { en: string, ja: string } => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
=======

const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex].originalWord.toUpperCase();
>>>>>>> 6c04930 ([add]和訳機能の追加(不完全))
}

// ★型のエイリアスを定義
type Translations = { [key: string]: string };

interface WordleProps {
  onYellowLettersChange: (letters: string[]) => void;
  onGreenLettersChange: (letters: {char: string, index: number}[]) => void;
}

export default function Wordle({ onYellowLettersChange, onGreenLettersChange }: WordleProps) {
  const [guesses, setGuesses] = useState<string[]>(Array(NUMBER_OF_GUESS_ROWS).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // ★成功状態を追加

<<<<<<< HEAD
  // --- ★追加: ダイアログの状態を管理
  const [dialog, setDialog] = useState({ isOpen: false, message: '' });

  // --- ★追加: 連続正解数とゲーム状態を管理
  const [winStreak, setWinStreak] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // --- ★追加: キーボードの各キーの色を管理するState
=======
>>>>>>> 6c04930 ([add]和訳機能の追加(不完全))
  const [keyStates, setKeyStates] = useState<{[key: string]: string}>({});
  const [flipStates, setFlipStates] = useState<boolean[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false))
  );
<<<<<<< HEAD
  // ---
  // --- ★変更: ターゲットワードをオブジェクトとして管理
  const [targetWordObj, setTargetWordObj] = useState(getRandomWord());
  const targetWord = targetWordObj.en.toUpperCase(); // 評価用の英語単語

  // --- ★追加: 各タイルの評価状態（色）を管理するState
=======
  const [targetWord, setTargetWord] = useState(getRandomWord());
>>>>>>> 6c04930 ([add]和訳機能の追加(不完全))
  const [evaluationStates, setEvaluationStates] = useState<string[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''))
  );

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

    const newEvaluation = currentGuess.map((char, index) => {
      if (char.toUpperCase() === targetWord[index].toUpperCase()) {
        return 'bg-green-700';
      } else if (targetWord.toUpperCase().includes(char.toUpperCase())) {
        return 'bg-yellow-500';
      } else {
        return 'bg-gray-700';
      }
    });

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
        setIsSuccess(true); // ★成功状態をセット
        setIsGameOver(true);
      } else if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {
        setIsSuccess(false); // ★失敗状態をセット
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
    if (!targetWord) return;

    if (isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) {
      setGameMessage('ゲームは終了しました。Resetを押してください。');
      return;
    }

    const currentLettersCount = currentGuess.filter(char => char !== '').length;
    if (currentLettersCount >= NUMBER_OF_LETTERS_PER_GUESS && buttonLabel !== 'Backspace') {
      return;
    }

    if (buttonLabel === 'Backspace') {
      setCurrentGuess(prevGuess => {
        const newGuess = [...prevGuess];
        for (let i = newGuess.length - 1; i >= 0; i--) {
          if (newGuess[i] !== '') {
            newGuess[i] = '';
            break;
          }
        }
        return newGuess;
      });
    } else {
      setCurrentGuess(prevGuess => {
        const newGuess = [...prevGuess];
        for (let i = 0; i < newGuess.length; i++) {
          if (newGuess[i] === '') {
            newGuess[i] = buttonLabel;
            break;
          }
        }
        return newGuess;
      });
    }

    setGameMessage('');

  };

  const handleResetClick = () => {
    // ★ゲームを途中でリセットした場合、連勝をリセット
    if (gameStatus === 'playing') {
      setWinStreak(0);
    }

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

  // ★日本語訳を取得するヘルパー関数
  const getTranslatedWord = (word: string): string => {
    return translations[word.toLowerCase()] || '翻訳が見つかりません';
    
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
      <h2 className="text-2xl font-bold mb-4">5文字を当てようゲーム</h2>
      {/* ★追加: 連続正解数カウンター */}
      <div className="mb-4">
        <p className="text-lg">連続正解: <span className="font-bold">{winStreak}</span></p>
      </div>

      <div className="space-y-3 mb-5">
        {Array.from({ length: NUMBER_OF_GUESS_ROWS }).map((_, rowIndex) => {
          const rowContent =
            rowIndex < currentRowIndex
              ? guesses[rowIndex].split('')
              : rowIndex === currentRowIndex
                ? currentGuess
                : Array(NUMBER_OF_LETTERS_PER_GUESS).fill('');

          return (
            <div key={rowIndex} className="flex justify-center gap-3">
              {rowContent.map((char, charIndex) => {
                let tileStateClass = '';
                if (rowIndex < currentRowIndex) {
                  tileStateClass = evaluationStates[rowIndex][charIndex];
                } else if (rowIndex === currentRowIndex && char !== '') {
                  tileStateClass = 'bg-blue-700';
                } else {
                  tileStateClass = 'bg-gray-700';
                }

                const commonTileClasses = `
                  border border-blue-500 p-4 min-h-16 w-16
                  rounded-md flex items-center justify-center text-xl font-bold
                  break-words
                `;

                return (
                  <div
                    key={charIndex}
                    className={`flip-card ${flipStates[rowIndex][charIndex] ? 'flipped' : ''}`}
                  >
                    <div className="flip-card-inner">
                      <div
                        className={`flip-card-front ${commonTileClasses} ${tileStateClass}
                          ${rowIndex === currentRowIndex && charIndex === currentGuess.filter(c => c !== '').length && 'border-white'}
                        `}
                      >
                        {char}
                      </div>
                      <div className={`flip-card-back ${commonTileClasses} ${evaluationStates[rowIndex][charIndex]}`}>
                        {char}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameMessage && (
        <div className="mt-4 p-3 bg-yellow-500 text-black rounded-md font-bold text-lg">
          {gameMessage}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-5 mb-8">
        <AlphabetButton label="Enter" onButtonClick={handleEnterClick} />
        <AlphabetButton label="Reset" onButtonClick={handleResetClick} />
        <AlphabetButton label="Backspace" onButtonClick={() => handleButtonClick('Backspace')} />
      </div>

      <div className="flex justify-center flex-col items-center space-y-2">
        <div className="flex justify-center gap-2 flex-wrap">
          {'QWERTYUIOP'.split('').map(label => (
            <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />
          ))}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {'ASDFGHJKL'.split('').map(label => (
            <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />
          ))}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {'ZXCVBNM'.split('').map(label => (
            <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} colorClass={keyStates[label]} />
          ))}
        </div>
      </div>


      {/* ★ResultModalの呼び出しに変更 */}
      {isGameOver && (
        <ResultModal
          isSuccess={isSuccess}
          targetWord={targetWord}
          translatedWord={getTranslatedWord(targetWord)}
          onReset={handleResetClick}
        />

      )}
    </div>
  );
}
