// testApi.js

import dotenv from 'dotenv';
// fetch APIがNode.js環境で利用できない場合のためにnode-fetchを導入する場合:
// import fetch from 'node-fetch'; // npm install node-fetch が必要

// 環境変数を読み込む
dotenv.config();

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY; // .envファイルからAPIキーを読み込む

// APIキーの存在チェック
if (!apiKey) {
  console.error('エラー: GOOGLE_TRANSLATE_API_KEY 環境変数が設定されていません。');
  console.error('.env ファイルに GOOGLE_TRANSLATE_API_KEY=あなたのAPIキー を記述してください。');
  process.exit(1); // APIキーがなければ終了
}

// テスト用の単語
const testWord = "hello"; 

async function testTranslationApi() {
  console.log(`APIキーのテストを開始します... (テスト単語: "${testWord}")`);
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: testWord,
        source: 'en',
        target: 'ja',
        format: 'text',
      })
    });

    if (!response.ok) {
      // HTTPステータスコードが200番台以外の場合
      const errorData = await response.json();
      console.error('API呼び出し失敗:');
      console.error(`HTTPステータス: ${response.status}`);
      console.error('APIエラーメッセージ:', errorData.error ? errorData.error.message : '詳細不明');
      console.error('考えられる原因: APIキーの無効化、APIが有効化されていない、課金設定の問題、APIキー制限の設定ミスなど');
      return false; // テスト失敗
    }

    const result = await response.json();
    const translatedText = result.data.translations[0].translatedText;

    console.log(`\n✅ API呼び出し成功！`);
    console.log(`テスト単語: "${testWord}"`);
    console.log(`翻訳結果: "${translatedText}"`);
    console.log(`APIキーは有効である可能性が高いです。`);
    return true; // テスト成功
  } catch (error) {
    // ネットワークエラーなど、fetch自体が失敗した場合
    console.error('\n❌ API呼び出し中に致命的なエラーが発生しました:');
    console.error('エラーメッセージ:', error.message);
    console.error('考えられる原因: ネットワーク接続の問題、URLの誤り、DNSエラーなど');
    return false; // テスト失敗
  }
}

// 関数を実行
testTranslationApi().then(success => {
  if (!success) {
    process.exit(1); // 失敗したらプロセスを終了
  }
});