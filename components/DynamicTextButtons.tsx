'use client';
import React, { useState } from 'react';
import AlphabetButton from './AlphabetButtons';

//　表示するテキストボックスの数を定義
const NUMBER_OF_TEXTBOXES = 5;
const TARGET_WORD = 'REACT'; //　判定したい特定の文字列を定義

// 各テキストボックスのデータを表現する型定義
type TextBoxItem = {
    id: number; // 各テキストボックスに一意のID
    text: string; // 表示する文字列
}

export default function DynamicTextButtons() {
    // テキストボックスに表示する文字列を管理するstate
    //初期化関数を定義して、ユニークなIDを持つ配列を生成
    const initializeTextBoxes = (): TextBoxItem[] => {
    return Array.from({ length: NUMBER_OF_TEXTBOXES }, (_, i) => ({
        id: Date.now() + i, // ユニークなIDを生成
        text: '' // 初期値はから文字列
    }));
    }

    const [displayedTexts, setDisplayedTexts] = useState<TextBoxItem[]>(initializeTextBoxes);

    //　判定結果メッセージを管理するstate
    const [resultMessage, setResultMessage] = useState('');

    //AlphabetButtonsがクリックされたときに呼び出されるハンドラ
    // クリックされたボタンのラベルを受け取り、それをdisplayedTextに設定
    const handleButtonClick = (buttonLabel: string) => {
        setResultMessage(''); // ボタンが押されうたびに判定メッセージをリセット
        setDisplayedTexts(prevTexts => {
            const newTexts = [...prevTexts]; //　現在の配列をコピー
            let updated = false;

            //　既存のテキストボックスの中から、まだ何も表示されていない場所を探す
            for (let i = 0; i < newTexts.length + 1; i++) {
                // 初期メッセージ（'ここにはボタンのラベルが表示'）も「空」とみなす
                if (newTexts[i].text  == '') {
                    newTexts[i] = { ...newTexts[i], text: `「 ${buttonLabel}」が押されました` };
                    updated = true;
                    break; //　見つかったらループを抜ける
                }
            }
            //もし全てのテキストボックスが埋まっていたら(オプション：末尾に追加)
                // このロジックは、上記で定義したNUMBER_OF_TEXTBOXESを超えてテキストボックスを増やしたい場合に有効
                if (!updated) {
                    //newTexts.push(`「${buttonLabel}」が押されました`);
                    //alert( '全てのテキストボックスが埋まりました!');
                    //newTexts[0] = { ...newTexts[0], text: `「${buttonLabel}」が上書きされました！` }; // 最初のボックスを上書き
                }
                return newTexts;
        });
    };

    // Enterボタンがクリックされたときのハンドラ
    const handleEnterClick = () => {
        console.log('Enterボタンがクリックされました！'); // まずはここを確認
        // 全てのテキストボックスが埋まっているか確認
        const allFilled = displayedTexts.every(item => item.text !== '');
        console.log('全てのテキストボックスが埋まっているか:', allFilled);

        if (!allFilled) {
            setResultMessage('全てのテキストボックスを埋めてください!');
            return;
        }

        // テキストボックスの文字列を結合（例: 「T」が入力されました -> T）
        // 各テキストの最初の文字（引用符とスペースを除く）を抽出して結合
        const extractedLetters = displayedTexts.map(item => {
            // 例: 「T」が入力されました → T
            // 正規表現を修正: 「 の後のスペースを \s* で許容し、「が押されました」に合わせる
            const match = item.text.match(/「\s*(.)」が押されました/);
            return match ? match[1] : ''; // マッチすれば2番目のグループ(1文字目)を返す
        }).join('')// 結合して1つの文字列にする)
        console.log('抽出された文字:', extractedLetters);

        // 結合した文字列とTARGET_WORDを比較
        if (extractedLetters.toUpperCase() == TARGET_WORD.toUpperCase()) {
            setResultMessage(`正解です!「 ${TARGET_WORD}」と一致しました!`);
        } else {
            setResultMessage(`不正解です。「 ${TARGET_WORD}」と一致しません。`);
        }
        console.log('最終メッセージ:', resultMessage); // 注意: これはsetResultMessage後の即時反映ではない
    }

    // リセットボタンがクリックされたときのハンドラ
    const handleResetClick = () => {
        // ここでdisplayedTextsの各要素を新しい空文字列で埋め直す
        // これにより、Reactが要素を再レンダリングするのを促す
        //setDisplayedTexts(Array(NUMBER_OF_TEXTBOXES).fill('')); // 全てのテキストボックスを空にする
        setDisplayedTexts(initializeTextBoxes()); //ここ修正
        setResultMessage(''); //結果メッセージもリセット
    }

    return (
        <div className="p-5 border border-gray-300 rounded-lg max-w-4xl mx-auto text-center my-5">
            <h2 className="text-2xl font-bond mb-4">
                AlphabetButtonを使った動的テキスト表示
            </h2>

            {/* 複数のテキストボックス表示エリア　*/}
            {/* <div className="flex justify-center"> */}
                <div className="grid grid-flow-col auto-cols-max gap-3 mb-5 mx-auto max-w-full">
                {displayedTexts.map((item) => (
                    <div
                        key={item.id} // Reactのリストレンダリングにはkeyが必要
                        className="
                            border border-blue-500 p-4 min-h-20 bg-blue-700 text-white
                            rounded-md flex items-center justify-center text-xl font-bold
                            break-words
                            w-32 sm:w-36 md:w-40 {/* 各テキストボックスの幅を固定または制限 */}
                            flex-shrink-0 {/* テキストボックスが縮むのを防ぐ - Gridでも使えますが、必要に応じて削除 */}
                        "
                        // Gridのgapでマージンは管理されるため、個別のスタイルは不要
                    >
                         {/* テキストが空の場合に初期メッセージを表示 */}
                         {item.text === '' ? 'ここにはボタンのラベルが表示' : item.text}
                    </div>
                ))}
                </div>
            {/* </div> */}

            {/* 判定結果メッセージ表示エリア */}
            {resultMessage && ( // resultMessageがある場合のみ表示
                <div className="mt-4 p-3 bg-yellow-500 text-black rounded-md font-bold text-lg">
                    {resultMessage}
                </div>
            )}
            
            {/* EnterボタンとResetボタンのグループ */}
            <div className="flex justify-center gap-4 mt-5 mb-8">
                <AlphabetButton label="Enter" onButtonClick={handleEnterClick} />
                <AlphabetButton label="Reset" onButtonClick={handleResetClick} />
            </div>

            {/* AlphabetButtonのグループ　*/}
            <div className="flex justify-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    <AlphabetButton label="Q" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="W" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="E" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="D" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="R" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="T" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="Y" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="U" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="I" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="O" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="P" onButtonClick={handleButtonClick} />
                </div>
            </div>
            
            <div className="flex justify-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    <AlphabetButton label="A" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="S" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="D" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="F" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="G" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="H" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="J" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="K" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="L" onButtonClick={handleButtonClick} />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="flex justify-center gap-2 flex-wrap mb-4">
                    <AlphabetButton label="Z" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="X" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="C" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="V" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="B" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="N" onButtonClick={handleButtonClick} />
                    <AlphabetButton label="M" onButtonClick={handleButtonClick} />
                </div>
            </div>
      
      
      </div>
        
    );
    }
