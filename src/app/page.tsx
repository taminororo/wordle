'use client'; // クライアントサイドでの実行を明示

import TestButton from '../components/TestButton'; // TestButtonはもし不要なら削除してもOKです
import DynamicTextButtons from '../components/DynamicTextButtons';
import BackgroundCascade from '../components/BackgroundCasacde'; // ★ここを追加: 背景コンポーネントをインポート

export default function MyApp() {
  return (
    // ★修正点1: 全体を囲むdivに relative と min-h-screen を追加
    // relative は子要素の absolute 配置の基準となり、
    // min-h-screen は背景が少なくとも画面の高さ全体を覆うようにします。
    <div className="relative min-h-screen bg-gray-900 text-white"> {/* 全体の背景色と文字色を調整すると見やすくなります */}

      {/* ★修正点2: BackgroundCascade コンポーネントを配置 */}
      {/* このコンポーネントは absolute で配置されるため、親の relative の中で適切に配置されます。 */}
      {/* z-0 は他のコンテンツの背後に配置されることを意味します（global.cssで設定済み）。 */}
      <BackgroundCascade />

      {/* ★修正点3: Wordleゲームのコンテンツを囲むdivに relative と z-10 を追加 */}
      {/* z-10 は背景の上に表示されることを保証します。 */}
      <div className="container mx-auto mt-8 relative z-10">
        {/* テストセクション (もし不要であれば、このセクション全体を削除できます) */}
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
            <h1 className="text-3xl font-bold mb-8">wordle</h1> {/* font-boldを追加 */}
            <DynamicTextButtons />
          </div>
        </section>
      </div>
    </div>
  );
}