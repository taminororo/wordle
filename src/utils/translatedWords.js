import * as fs from 'fs';
import * as path from 'path'; // ← この行を追加
import { WORD_LIST } from './words.js';
import myData from '../data/translated_words.json' with { type: 'json' };
import { fileURLToPath } from 'url'; // ES Modulesで __dirname を使うためのヘルパー


// ES Modulesで __dirname と __filename を取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ここで translatedWordsData を使って処理を行う
//const translatedData = JSON.parse(myData);
console.log("読み込んだ翻訳データ（最初の10件）:");
console.log(myData.slice(0, 10));

// WORD_LIST と translatedWordsData を合成する
const combinedList = [];
const maxLength = Math.min(WORD_LIST.length, myData.length);

for (let i = 0; i < maxLength; i++) {
    combinedList.push({
        originalWord: WORD_LIST[i],
        translatedWord: myData[i]
    });
}
console.log("\n合成されたリスト（最初の10件）:");
console.log(combinedList.slice(0, 10));

// 1. 保存するファイルパスを定義
const finalOutputPath = path.join(__dirname, '../data/combined_word_list.json');

// 2. combinedList をJSON形式の文字列に変換
//    (null, 2) を付けると、人間が読みやすいように整形される
const finalJsonOutput = JSON.stringify(combinedList, null, 2);

// 3. ファイルに書き込む
fs.writeFileSync(finalOutputPath, finalJsonOutput, 'utf8');

console.log(`\n✅ 合成済みリストが ${finalOutputPath} に保存されました。`);