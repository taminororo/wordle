// scripts/generateTranslations.js の一番上（import文の後）に追加

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // アプリケーションによってはここでプロセスを終了させる
  // process.exit(1);
});

// --- 既存のコードが続く ---
import dotenv from 'dotenv';
import { WORD_LIST } from '../src/utils/words.js'; // WORD_LISTへのパスを調整してください
import * as fs from 'fs';   // Node.jsのファイルシステムモジュールをインポート
import * as path from 'path'; // パスを扱うためのモジュールをインポート
import { fileURLToPath } from 'url'; // ES Modulesで __dirname を使うためのヘルパー

// ES Modulesで __dirname と __filename を取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数を読み込む
dotenv.config();

// APIキーの確認
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!apiKey) {
  console.error('エラー: GOOGLE_TRANSLATE_API_KEY 環境変数が設定されていません。');
  console.error('.env ファイルに GOOGLE_TRANSLATE_API_KEY=あなたのAPIキー を記述してください。');
  process.exit(1); // APIキーがなければ終了
}

// 翻訳対象の単語リストを直接使用
const array2 = WORD_LIST;

// 非同期翻訳関数
async function translateSingleWord(word) {
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: word, // 単一の単語を渡す
        source: 'en',
        target: 'ja',
        format: 'text',
      })
    });

    if (!response.ok) {
      // エラー時の詳細ログ
      const errorData = await response.json().catch(() => ({}));
      console.error(`翻訳エラー: HTTPステータス ${response.status} ${response.statusText} (単語: ${word})`);
      if (errorData.error) {
        console.error(`  エラーコード: ${errorData.error.code}`);
        console.error(`  エラーメッセージ: ${errorData.error.message}`);
        if (errorData.error.details) {
          console.error(`  詳細:`, errorData.error.details);
        }
      } else {
        console.error(`  APIからJSON形式のエラーデータが返されませんでした。レスポンスボディ:`, JSON.stringify(errorData));
      }
      // エラーを再スローして Promise.all を拒否させる
      throw new Error(`APIリクエストが失敗しました。詳細は上記ログを確認してください。`);
    }

    const result = await response.json();
    return result.data.translations[0].translatedText; // 翻訳結果のテキストを返す
  } catch (error) {
    // ネットワークエラーや、上記でスローされたAPIエラーをキャッチ
    console.error('致命的な翻訳エラー:', error.message, `(単語: ${word})`);
    console.log("IN")
    return "翻訳失敗"; // 失敗時のプレースホルダーを返す（エラーで処理を止めない場合）
    
  }
}

// // --- 既存のコードの上部はそのまま ---

// 処理の間に待機時間を入れるためのヘルパー関数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// メインの処理関数
async function main() {
  console.log(`main関数実行: 翻訳対象の単語数: ${array2.length}`);
  
  const allTranslatedData = []; // すべての翻訳結果をここに格納する
  const BATCH_SIZE = 50; // 一度に翻訳する単語の数（50程度から試すのがおすすめ）
  const DELAY_MS = 1000; // 各バッチの後に待機する時間（ミリ秒）。1秒=1000ms

  // 単語リストをバッチサイズのチャンク（かたまり）に分割して処理
  for (let i = 0; i < array2.length; i += BATCH_SIZE) {
    const chunk = array2.slice(i, i + BATCH_SIZE);
    console.log(`バッチ ${Math.floor(i / BATCH_SIZE) + 1} を処理中... (単語数: ${chunk.length})`);

    const translationPromises = chunk.map(word => translateSingleWord(word));
    
    // このチャンクの翻訳を並行して実行
    const translatedChunk = await Promise.all(translationPromises);

    // 成功した翻訳結果を最終的な配列に追加
    allTranslatedData.push(...translatedChunk);

    // 次のバッチを処理する前に少し待つ（レート制限を避けるため）
    // 最後のバッチの後には待つ必要はない
    if (i + BATCH_SIZE < array2.length) {
      console.log(`${DELAY_MS}ms 待機します...`);
      await sleep(DELAY_MS);
    }
  }


  console.log(`すべての翻訳が完了しました。翻訳結果の配列の長さ: ${allTranslatedData.length}`);

  // 翻訳結果をJSON文字列に変換
  const jsonOutput = JSON.stringify(allTranslatedData, null, 2); 
  console.log("翻訳結果がJSON形式に変換されました。");

  // --- JSONファイルを保存する処理 ---
  // (この部分は変更なし)
  const outputDir = path.resolve(__dirname, '../../data'); 
  const outputPath = path.join(outputDir, 'translated_words.json');

  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, jsonOutput, 'utf8');
  console.log(`翻訳結果のJSONファイルが ${outputPath} に保存されました。`);
  // --- 保存処理ここまで ---
}

// // --- main関数の呼び出し部分はそのまま ---

// main関数を実行し、完了またはエラーをログに記録
main().then(() => {
  console.log("翻訳処理が正常に完了しました。");
}).catch(error => {
  console.error("翻訳処理中に予期せぬエラーが発生しました:", error);
  // エラー発生時はプロセスを終了
  process.exit(1); 
});