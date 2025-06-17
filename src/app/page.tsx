'use client';
import TestButton from '../components/TestButton';
import DynamicTextButtons from '../components/DynamicTextButtons';
import { useState, useEffect, useCallback } from 'react'; // useCallback をインポート

export default function MyApp() {
  const [flipStates, setFlipStates] = useState(Array(30).fill(false));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [correctWord, setCorrectWord] = useState<string>('APPLE');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // handleEnterをuseCallbackでメモ化
  const handleEnter = useCallback(() => {
    if (currentGuess.length !== 5) {
      // TODO: エラーメッセージを表示
      console.log("5文字入力してください");
      return;
    }

    // 新しい推測をguesses配列に追加
    setGuesses(prevGuesses => [...prevGuesses, currentGuess]);

    // flipアニメーションのための状態更新
    const newFlipStates = [...flipStates];
    for (let i = 0; i < 5; i++) {
      newFlipStates[currentRowIndex * 5 + i] = true;
    }
    setFlipStates(newFlipStates);

    // 勝敗判定
    if (currentGuess === correctWord) {
      setGameStatus('won');
    } else if (currentRowIndex === 5) {
      setGameStatus('lost');
    }

    // 次の行へ
    setCurrentRowIndex(prevRowIndex => prevRowIndex + 1);
    setCurrentGuess('');

  }, [currentGuess, correctWord, currentRowIndex, flipStates, guesses]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + event.key.toUpperCase());
      } else if (event.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (event.key === 'Enter') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // 依存配列に`useCallback`でメモ化した関数と、直接利用するstateを追加
  }, [gameStatus, currentGuess.length, handleEnter]);


  // `newGuessResult` はJSX側で同様のロジックが実装されているため不要
  // ... (handleEnter内の newGuessResult の計算は削除)


  return (
    <div className="container mx-auto mt-8">
      {/* (省略) テストセクション */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">テスト</h1>
        <div>
          <input
            type="text"
            maxLength={10}
            className="border border-gray-300 rounded p-2 mb-4 w-100"
          />
        </div>
        <main className="p-8">
          <h1 className="text-xl mb-4">テストページ</h1>
          <TestButton label="おはよう" />
        </main>
      </section>

      {/* (省略) アニメーションセクション */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">アニメーション</h2>
        <div>
          <input
            type="text"
            placeholder="回転するテキストボックス"
            className="w-64 h-8 p-2 border border-gray-300 transform rotate-45 origin-center"
          />
        </div>
        <div>
          <div className="w-16 h-16 bg-red-500 rounded-full animate-spin"></div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 animate-wiggle">
            ユラユラ動くテキスト
          </div>
          <p className="mt-4 text-xl text-green-700 animate-fadeInDown">
            上からフェードインする文章
          </p>
        </div>
        <div className="relative h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-500"></span>
        </div>
      </section>

      {/* (省略) Wordleセクション */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Wordle</h2>
        <div className="font-sans text-center p-5">
          <h1 className="text-3xl font bold mb-8">wordle</h1>
          <DynamicTextButtons />
        </div>
      </section>

      {/* 入力セクション */}
      <section>
        <h2 className="text-xl font-bold mb-4">入力</h2>
        {/* 5x6の入力フィールド */}
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex.toString()} className="flex justify-center">
            <div className="grid grid-flow-col auto-cols-max gap-2">
              {Array.from({ length: 5 }, (_, colIndex) => {
                const cellIndex = rowIndex * 5 + colIndex;
                let char = '';
                let tileState = ''; // bg-colorの代わりに状態を管理

                if (rowIndex < guesses.length) {
                  // 過去の推測
                  const guessedChar = guesses[rowIndex][colIndex];
                  char = guessedChar;
                  if (correctWord[colIndex] === guessedChar) {
                    tileState = 'correct';
                  } else if (correctWord.includes(guessedChar)) {
                    tileState = 'present';
                  } else {
                    tileState = 'absent';
                  }
                } else if (rowIndex === currentRowIndex) {
                  // 現在の入力行
                  char = currentGuess[colIndex] || '';
                }

                // CSSクラスを動的に決定
                const frontClass = `border border-gray-400 rounded w-14 h-14 text-2xl font-bold flex items-center justify-center`;
                const backClass = `${frontClass} ${
                  tileState === 'correct' ? 'bg-green-500 text-white border-green-500' :
                  tileState === 'present' ? 'bg-yellow-500 text-white border-yellow-500' :
                  tileState === 'absent' ? 'bg-gray-500 text-white border-gray-500' : ''
                }`;

                return (
                  <div
                    key={colIndex.toString()}
                    className={`flip-card ${flipStates[cellIndex] ? 'flipped' : ''}`}
                  >
                    <div className="flip-card-inner">
                      <div className={`flip-card-front ${frontClass}`}>
                        {char}
                      </div>
                      <div className={`flip-card-back ${backClass}`}>
                        {char}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
        {gameStatus === 'won' && <div className="text-center text-2xl font-bold text-green-600 mt-4">You Won!</div>}
        {gameStatus === 'lost' && <div className="text-center text-2xl font-bold text-red-600 mt-4">You Lost! The word was: {correctWord}</div>}
    </div>
  );
}