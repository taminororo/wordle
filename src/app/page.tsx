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
        
        <main className="p-8">
          <h1 className="text-xl mb-4">テストページ</h1>
          <TestButton label="おはよう" />
        </main>
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
