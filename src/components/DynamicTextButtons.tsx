'use client';

import React, { useState } from 'react';

import AlphabetButton from './AlphabetButtons';



// 定義はそのまま

const NUMBER_OF_LETTERS_PER_GUESS = 5;

const TARGET_WORD = 'REACT';

const NUMBER_OF_GUESS_ROWS = 5;



export default function DynamicTextButtons() {

const [guesses, setGuesses] = useState<string[]>(Array(NUMBER_OF_GUESS_ROWS).fill(''));

const [currentGuess, setCurrentGuess] = useState<string[]>(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));

const [currentRowIndex, setCurrentRowIndex] = useState(0);

const [gameMessage, setGameMessage] = useState('');

const [isGameOver, setIsGameOver] = useState(false);



// --- ★追加: 各タイルのフリップ状態を管理するState

const [flipStates, setFlipStates] = useState<boolean[][]>(

Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false))

);

// ---



const handleButtonClick = (buttonLabel: string) => {

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



// --- ★変更: フリップアニメーションをトリガー

// まず、現在の行のタイルのフリップ状態をtrueに設定する新しい配列を作成

const newFlipStates = [...flipStates];

newFlipStates[currentRowIndex] = Array(NUMBER_OF_LETTERS_PER_GUESS).fill(true);

setFlipStates(newFlipStates);

// ---



// 推測を結合して、ターゲットワードと比較

if (currentGuessString.toUpperCase() === TARGET_WORD.toUpperCase()) {

// 少し遅延させてからメッセージを表示し、ゲーム終了

setTimeout(() => {

setGameMessage(`正解です！「${TARGET_WORD}」`);

setIsGameOver(true);

}, NUMBER_OF_LETTERS_PER_GUESS * 150 + 800); // 各タイルのアニメーション時間＋α



// 最後の正解をguessesに反映 (フリップアニメーションと並行して行われる)

setGuesses(prevGuesses => {

const newGuesses = [...prevGuesses];

newGuesses[currentRowIndex] = currentGuessString;

return newGuesses;

});



} else {

// 不正解の場合、現在の推測を確定し、次の行へ

setGameMessage('不正解です。もう一度試してください。');



// guessesの更新はフリップアニメーションが完了してから行うとより自然

setTimeout(() => {

setGuesses(prevGuesses => {

const newGuesses = [...prevGuesses];

newGuesses[currentRowIndex] = currentGuessString; // 現在の入力行を確定

return newGuesses;

});



// 次の行へ移動

setCurrentRowIndex(prevIndex => prevIndex + 1);



// currentGuessをリセット

setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));



// 次の行のフリップ状態をfalseにリセット (新しい行なのでフリップしていない状態)

setFlipStates(prevFlipStates => {

const resetFlipStates = [...prevFlipStates];

if (prevFlipStates[currentRowIndex + 1]) { // 次の行が存在する場合のみリセット

resetFlipStates[currentRowIndex + 1] = Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false);

}

return resetFlipStates;

});



// 最終試行の場合

if (currentRowIndex + 1 >= NUMBER_OF_GUESS_ROWS) {

setGameMessage(`ゲームオーバーです。「${TARGET_WORD}」が正解でした。`);

setIsGameOver(true);

}

}, NUMBER_OF_LETTERS_PER_GUESS * 150 + 800); // フリップアニメーションの完了を待つ

}

};



const handleResetClick = () => {

setGuesses(Array(NUMBER_OF_GUESS_ROWS).fill(''));

setCurrentGuess(Array(NUMBER_OF_LETTERS_PER_GUESS).fill(''));

setCurrentRowIndex(0);

setGameMessage('');

setIsGameOver(false);

// --- ★追加: リセット時にフリップ状態も初期化

setFlipStates(Array(NUMBER_OF_GUESS_ROWS).fill(null).map(() => Array(NUMBER_OF_LETTERS_PER_GUESS).fill(false)));

// ---

};



return (

<div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">

<h2 className="text-2xl font-bold mb-4">

AlphabetButtonを使った動的テキスト表示

</h2>



{/* 各推測行の表示エリア */}

<div className="space-y-3 mb-5">

{Array.from({ length: NUMBER_OF_GUESS_ROWS }).map((_, rowIndex) => {

const rowContent = rowIndex < currentRowIndex

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

if (char.toUpperCase() === TARGET_WORD[charIndex].toUpperCase()) {

tileStateClass = 'bg-green-700'; // 正解の文字

} else if (TARGET_WORD.toUpperCase().includes(char.toUpperCase()) && char !== '') {

tileStateClass = 'bg-yellow-500'; // 含まれているが位置が違う

} else if (char !== '') {

tileStateClass = 'bg-gray-700'; // 含まれていない文字

}

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

style={{ animationDelay: `${charIndex * 150}ms` }} // 各タイルを少しずつ遅延させてフリップ

>

<div className="flip-card-inner">

{/* フロント面 */}

<div className={`flip-card-front ${commonTileClasses} ${tileStateClass}

${rowIndex === currentRowIndex && charIndex === currentGuess.filter(c => c !== '').length && 'border-white'}

`}>

{char}

</div>

{/* バック面 (正解判定後の色が付く) */}

<div className={`flip-card-back ${commonTileClasses} ${tileStateClass}`}>

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