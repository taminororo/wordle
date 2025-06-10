'use client';
import React, { useState } from 'react';
import AlphabetButton from './AlphabetButtons';

//　表示するテキストボックスの数を定義
const NUMBER_OF_TEXTBOXES = 5;

export default function DynamicTextButtons() {
    // テキストボックスに表示する文字列を管理するstate
    const [displayedTexts, setDisplayedText] = useState<string[]>(
        Array(NUMBER_OF_TEXTBOXES).fill( 'ここにはボタンのラベルが表示')
    )

    //AlphabetButtonsがクリックされたときに呼び出されるハンドラ
    // クリックされたボタンのラベルを受け取り、それをdisplayedTextに設定
    const handleButtonClick = (buttonLabel: string) => {
        setDisplayedText(prevTexts => {
            const newTexts = [...prevTexts]; //　現在の配列をコピー
            let updated = false;

            //　既存のテキストボックスの中から、まだ何も表示されていない場所を探す
            for (let i = 0; i < newTexts.length + 1; i++) {
                // 初期メッセージ（'ここにはボタンのラベルが表示'）も「空」とみなす
                if (newTexts[i]  == 'ここにはボタンのラベルが表示') {
                    newTexts[i] = `「 ${buttonLabel}」が押されました`;
                    updated = true;
                    break; //　見つかったらループを抜ける
                }
            }
            //もし全てのテキストボックスが埋まっていたら(オプション：末尾に追加)
                // このロジックは、上記で定義したNUMBER_OF_TEXTBOXESを超えてテキストボックスを増やしたい場合に有効
                if (!updated) {
                    //newTexts.push(`「${buttonLabel}」が押されました`);
                    //alert( '全てのテキストボックスが埋まりました!');
                }
                return newTexts;
        });
    };

    return (
        <div className="p-5 border border-gray-300 rounded-lg max-w-2xl mx-auto text-center my-5">
            <h2 className="text-2xl font-bond mb-4">
                AlphabetButtonを使った動的テキスト表示
            </h2>

            {/* 複数のテキストボックス表示エリア　*/}
            <div className="flex flex-wrap justify-center gap-3 mb-5 auto-cols-max">
                {displayedTexts.map((text, index) => (
                <div
                    key= {index} //　Reactのリストレンダリングにはkeyが必要
                    className="
                    border border-blue-500 p-4 min-h-20 mb-3 bg-blue-50
                    rounded-md flex items-center justify-center text-xl font-bold
                    text-gray-700 break-words
                    w-40 sm:w-48 md:w-56 
                    flex-shrink-0 
                    "
                    // 個別のmargin-bottomは、親のgapで管理するため不要になる
                    // style= {{ marginBottom: index === displayedTexts.length - 1 ? '20px' : '12px'}} //　最後の要素のmargin-bottomを調整
                >
                     {text}
                </div>
                ))}
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
