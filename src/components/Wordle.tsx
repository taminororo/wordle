'use client';

import React, { useState } from 'react';
import {WORD_LIST} from "../utils/words";
import AlphabetButton from './AlphabetButtons';

// 定義はそのまま
const NUMBER_OF_LETTERS_PER_GUESS = 5;
//const TARGET_WORD = 'REACT';
const NUMBER_OF_GUESS_ROWS = 5;
// --- ★追加: ターゲットワードをランダムに選ぶ
const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex].toUpperCase();
}

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>(Array(NUMBER_OF_GUESS_ROWS).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  // --- ★追加: ダイアログの状態を管理
  const [dialog, setDialog] = useState({ isOpen: false, message: '' });

  // --- ★追加: キーボードの各キーの色を管理するState
  const [keyStates, setKeyStates] = useState<{[key: string]: string}>({});

  // --- ★追加: 各タイルのフリップ状態を管理するState
  const [flipStates, setFlipStates] = useState<boolean[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false))
  );
  // ---
  // --- ★追加: ターゲットワードをランダムに設定
  const [targetWord, setTargetWord] = useState(getRandomWord());

  // --- ★追加: 各タイルの評価状態（色）を管理するState
  const [evaluationStates, setEvaluationStates] = useState<string[][]>(
    Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''))
  );
  // ---

//---------------
//ここから下はイベントハンドラ
//---------------

// キーボードまたはBackSpaceボタンがクリックされたときのイベントハンドラ
  const handleButtonClick = (buttonLabel: string) => {
    if (!targetWord) return; // ターゲットワードが未設定の場合は何もしない

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
    setGameMessage(''); // 入力中はメッセージをクリア
  };

  // Enterボタンがクリックされたときのイベントハンドラ
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

    // --- ★変更: 先に評価を行い、結果をStateに保存
    const newEvaluation = currentGuess.map((char, index) => {
      if (char.toUpperCase() === targetWord[index].toUpperCase()) {
        return 'bg-green-700'; // 正解
      } else if (targetWord.toUpperCase().includes(char.toUpperCase())) {
        return 'bg-yellow-500'; // 含まれているが位置が違う
      } else {
        return 'bg-gray-700'; // 含まれていない
      }
    });

    setEvaluationStates(prev => {
      const newStates = [...prev];
      newStates[currentRowIndex] = newEvaluation;
      return newStates;
    });

    // --- ★追加: キーボードの状態を更新
    const newKeyStates = { ...keyStates };
    newEvaluation.forEach((color, index) => {
      const char = currentGuess[index].toUpperCase();
      const currentColor = newKeyStates[char];

      // 緑は最優先、次に黄色、最後に灰色
      if (currentColor !== 'bg-green-700') {
        if (color === 'bg-green-700' || (color === 'bg-yellow-500' && currentColor !== 'bg-yellow-500')) {
          newKeyStates[char] = color;
        } else if (!currentColor) {
          newKeyStates[char] = color;
        }
      }
    });
    setKeyStates(newKeyStates);
    // ---

    // --- ★変更: フリップアニメーションを順番にトリガー
    for (let i = 0; i < NUMBER_OF_LETTERS_PER_GUESS; i++) {
      setTimeout(() => {
        setFlipStates(prev => {
          const newFlipStates = [...prev];
          if (newFlipStates[currentRowIndex]) {
            newFlipStates[currentRowIndex][i] = true;
          }
          return newFlipStates;
        });
      }, i * 150); // 150msずつ遅延させてフリップ
    }
    // ---

    // --- ★変更: フリップアニメーションの完了後にゲーム終了処理を行う
    const totalAnimationTime = (NUMBER_OF_LETTERS_PER_GUESS - 1) * 150 + 600; // (最後のタイル遅延 + アニメーション時間)

    setTimeout(() => {
      if (currentGuessString.toUpperCase() === targetWord.toUpperCase()) {
        // 正解の場合
        setDialog({ isOpen: true, message: `正解です！「${targetWord}」` });
        setIsGameOver(true);
      } else if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {
        // ゲームオーバーの場合
        setDialog({ isOpen: true, message: `ゲームオーバーです。「${targetWord}」が正解でした。` });
        setIsGameOver(true);
      } else {
        // ゲーム続行の場合
        //setGameMessage('不正解です。もう一度試してください。');
      }

      // 共通の行更新処理
      setGuesses(prevGuesses => {
        const newGuesses = [...prevGuesses];
        newGuesses[currentRowIndex] = currentGuessString;
        return newGuesses;
      });
      setCurrentRowIndex(prevIndex => prevIndex + 1);
      setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));

    }, totalAnimationTime);
  };

  const handleResetClick = () => {
    setGuesses(Array(NUMBER_OF_GUESS_ROWS).fill(''));
    setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
    setCurrentRowIndex(0);
    setGameMessage('');
    setIsGameOver(false);
    setDialog({ isOpen: false, message: '' }); // ★ダイアログを閉じる
    setKeyStates({}); // ★キーボードの状態をリセット
    // --- ★追加: リセット時にフリップ状態も初期化
    setFlipStates(Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false)));
    setEvaluationStates(Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''))); // ★評価状態もリセット
    setTargetWord(getRandomWord()); // ターゲットワードもリセット
    // ---
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
      <h2 className="text-2xl font-bold mb-4">5文字を当てようゲーム</h2>

      {/* 各推測行の表示エリア */}
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
                // --- ★変更: ここからフリップコンポーネントのJSX構造
                let tileStateClass = ''; // タイルの状態に応じた背景色
                if (rowIndex < currentRowIndex) {
                  // 確定済みの行
                  tileStateClass = evaluationStates[rowIndex][charIndex];
                } else if (rowIndex === currentRowIndex && char !== '') {
                  // 入力中の文字
                  tileStateClass = 'bg-blue-700';
                } else {
                  // 空のボックス
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
                    // ★フリップのラッパー
                    className={`flip-card ${flipStates[rowIndex][charIndex] ? 'flipped' : ''}`}
                  >
                    <div className="flip-card-inner">
                      {/* フロント面 */}
                      <div
                        className={`flip-card-front ${commonTileClasses} ${tileStateClass}
                          ${rowIndex === currentRowIndex && charIndex === currentGuess.filter(c => c !== '').length && 'border-white'}
                        `}
                      >
                        {char}
                      </div>
                      {/* バック面 (正解判定後の色が付く) */}
                      <div className={`flip-card-back ${commonTileClasses} ${evaluationStates[rowIndex][charIndex]}`}>
                        {char}
                      </div>
                    </div>
                  </div>
                );
                // --- ★変更ここまで
              })}
            </div>
          );
        })}
      </div>

      {/* ゲームメッセージ表示エリア */}
      {gameMessage && (
        <div className="mt-4 p-3 bg-yellow-500 text-black rounded-md font-bold text-lg">
          {gameMessage}
        </div>
      )}

      {/* EnterボタンとResetボタンのグループ */}
      <div className="flex justify-center gap-4 mt-5 mb-8">
        <AlphabetButton label="Enter" onButtonClick={handleEnterClick} />
        <AlphabetButton label="Reset" onButtonClick={handleResetClick} />
        <AlphabetButton label="Backspace" onButtonClick={() => handleButtonClick('Backspace')} />
      </div>

      {/* AlphabetButtonのグループ（キーボード部分） */}
      <div className="flex justify-center flex-col items-center space-y-2"> {/* space-y-2で行間を追加 */}
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

      {/* ★追加: フラッシュダイアログ */}
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-2xl font-bold mb-6">{dialog.message}</h3>
            <AlphabetButton label="もう一度プレイ" onButtonClick={handleResetClick} />
          </div>
        </div>
      )}
    </div>
  );
}
