'use client';
import React, { useState } from 'react';
import AlphabetButton from './AlphabetButtons';

//　表示するテキストボックスの数を定義
const NUMBER_OF_LETTERS_PER_GUESS = 5; // 各行の文字数
const TARGET_WORD = 'REACT'; //　判定したい特定の文字列を定義
const NUMBER_OF_GUESS_ROWS =5;

// 各テキストボックスのデータを表現する型定義
//type TextBoxItem = {
//     id: number; // 各テキストボックスに一意のID
//     text: string; // 表示する文字列
// }

export default function DynamicTextButtons() {
    /// 過去の推測（確定した行）の配列。各要素は文字列
    const [guesses, setGuesses] = useState<string[]>(Array(NUMBER_OF_GUESS_ROWS).fill(''));

    // 現在入力中の文字の配列。各要素は1文字
    const [currentGuess, setCurrentGuess] = useState<string[]>(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));

    // 現在入力中の行のインデックス (0から始まる)
    const [currentRowIndex, setCurrentRowIndex] = useState(0);

    // 判定結果やゲーム全体のメッセージ
    const [gameMessage, setGameMessage] = useState('');

    // ゲームが終了したかどうかのフラグ
    const [isGameOver, setIsGameOver] = useState(false);

    //AlphabetButtonsがクリックされたときに呼び出されるハンドラ
    const handleButtonClick = (buttonLabel: string) => {
        if (isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) {
            setGameMessage('ゲームは終了しました。Resetを押してください。');
            return;
        }

        // 現在の推測がすでに5文字なら、新しい文字は追加しない
        const currentLettersCount = currentGuess.filter(char => char !== '').length;
        if (currentLettersCount >= NUMBER_OF_LETTERS_PER_GUESS && buttonLabel !== 'Backspace') {
            return;
        }

        if (buttonLabel === 'Backspace') {
            //Backspaceの場合、最後の文字を消去
            setCurrentGuess(prevGuess => {
                const newGuess = [...prevGuess];
                for (let i = newGuess.length - 1; i >= 0; i--) {
                    if (newGuess[i] !== '') {
                        newGuess[i] = '';
                        break;
                    }
                }
                return newGuess;
            })
        } else {
            // 通常のアルファベット入力の場合
            setCurrentGuess(prevGuess => {
                const newGuess = [...prevGuess];
                for (let i = 0; i < newGuess.length; i++) {
                    if (newGuess[i] === '') {
                        newGuess[i] = buttonLabel;
                        break;
                    }
                }
                return newGuess;
            })
        }
        setGameMessage('')// 入力中はメッセージをクリア
    };

    // Enterボタンがクリックされたときのハンドラ
    const handleEnterClick = () => {
        if (isGameOver || currentRowIndex >= NUMBER_OF_GUESS_ROWS) {
            setGameMessage('ゲームは終了しました。Resetを押してください。');
            return;
        }

        const currentGuessString = currentGuess.filter(char => char !== '').join('');

        // 5文字入力されているか確認
        if (currentGuessString.length !== NUMBER_OF_LETTERS_PER_GUESS) {
            setGameMessage(`${NUMBER_OF_LETTERS_PER_GUESS}文字入力してください！`);
            return;
        }

        // 推測を結合して、ターゲットワードと比較
        if (currentGuessString.toUpperCase() === TARGET_WORD.toUpperCase()) {
            setGameMessage(`正解です！「${TARGET_WORD}」`);
            setIsGameOver(true);
            
            // 最後の正解をguessesに反映
            setGuesses(prevGuesses => {
                const newGuesses = [...prevGuesses];
                newGuesses[currentRowIndex] = currentGuessString;
                return newGuesses;
            });

        } else {
            // 不正解の場合、現在の推測を確定し、次の行へ
            setGameMessage('不正解です。もう一度試してください。');
            setGuesses(prevGuesses => {
                const newGuesses = [...prevGuesses];
                newGuesses[currentRowIndex] = currentGuessString; // 現在の入力行を確定
                return newGuesses;
            });

            // 次の行へ移動
            setCurrentRowIndex(prevIndex => prevIndex + 1);

            // currentGuessをリセット
            setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));

            // 最終試行の場合
            if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {
                setGameMessage(`ゲームオーバーです。「${TARGET_WORD}」が正解でした。`);
                setIsGameOver(true);
            }
        }
    };

    // リセットボタンがクリックされたときのハンドラ
    const handleResetClick = () => {
        setGuesses(Array(NUMBER_OF_GUESS_ROWS).fill(''));
        setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));
        setCurrentRowIndex(0);
        setGameMessage('');
        setIsGameOver(false);
    };
    return (
        <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
            <h2 className="text-2xl font-bond mb-4">
                AlphabetButtonを使った動的テキスト表示
            </h2>

            
            {/* 各推測行の表示エリア */}
            <div className="space-y-3 mb-5"> {/* 各行間にスペース */}
            {/* <div className="flex justify-center"> */}
                {Array.from({ length: NUMBER_OF_GUESS_ROWS }).map((_, rowIndex) => {
                    const rowContent = rowIndex < currentRowIndex
                        ? guesses[rowIndex].split('') // 確定済みの行
                        : rowIndex === currentRowIndex
                            ? currentGuess // 現在入力中の行
                            : Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''); // 未入力の行

                    return (
                        <div key={rowIndex} className="flex justify-center gap-3">
                            {rowContent.map((char, charIndex) => (
                                <div
                                    key={charIndex}
                                    className={`
                                        border border-blue-500 p-4 min-h-16 w-16
                                        rounded-md flex items-center justify-center text-xl font-bold
                                        break-words
                                        ${
                                            rowIndex < currentRowIndex && char !== ''
                                                ? (
                                                    char.toUpperCase() === TARGET_WORD[charIndex].toUpperCase()
                                                        ? 'bg-green-700' // 正解の文字
                                                        : 'bg-red-700' // 不正解の文字
                                                )
                                                : rowIndex === currentRowIndex && char !== ''
                                                    ? 'bg-blue-700' // 入力中の文字
                                                    : 'bg-gray-700' // 空のボックス
                                        }
                                        ${rowIndex === currentRowIndex && charIndex === currentGuess.filter(c => c !== '').length && 'border-white'} {/* 現在の入力位置に白枠 */}
                                    `}
                                >
                                    {char}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* </div> */}

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
                <AlphabetButton label="Backspace" onButtonClick={() => handleButtonClick('Backspace')} /> {/* Backspaceボタン追加 */}
            </div>

            {/* AlphabetButtonのグループ（キーボード部分） */}
            <div className="flex justify-center flex-col items-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {'QWERTYUIOP'.split('').map(label => (
                        <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} />
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center flex-col items-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {'ASDFGHJKL'.split('').map(label => (
                        <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} />
                    ))}
                </div>
            </div>

            <div className="flex justify-center flex-col items-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {'ZXCVBNM'.split('').map(label => (
                        <AlphabetButton key={label} label={label} onButtonClick={handleButtonClick} />
                    ))}
                </div>
            </div>
        </div>
    );
}