'use client';
import TestButton from '../components/TestButton';
import DynamicTextButtons from '../components/DynamicTextButtons';
// useState, useEffect, useCallback はもう使わないので削除

export default function MyApp() {
  // 削除対象のステートと関数
  // const [flipStates, setFlipStates] = useState(Array(30).fill(false));
  // const [currentGuess, setCurrentGuess] = useState<string>('');
  // const handleEnter = useCallback(() => { /* ... */ }, []);
  // useEffect のフックも削除対象

  return (
    <div className="container mx-auto mt-8">
      {/* テストセクション */}
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

      {/* アニメーションセクション */}
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

      {/* Wordleセクション */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Wordle</h2>
        <div className="font-sans text-center p-5">
          <h1 className="text-3xl font bold mb-8">wordle</h1>
          <DynamicTextButtons />
        </div>
      </section>
    </div>
  );
}
