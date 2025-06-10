'use client';
import React, { useState } from 'react';
import AlphabetButton from './AlphabetButtons';

export default function DynamicTextButtons() {
    // テキストボックスに表示する文字列を管理するstate
    const [displayedText, setDisplayedText] = useState('ここにはボタンのラベルが表示');

    //AlphabetButtonsがクリックされたときに呼び出されるハンドラ
    // クリックされたボタンのラベルを受け取り、それをdisplayedTextに設定
    const handleButtonClick = (buttonLabel: string) => {
        setDisplayedText(`「${buttonLabel}」が押されました`);
    };

    return (
        <div className="p-5 border border-gray-300 rounded-lg max-w-2xl mx-auto text-center my-5">
            <h2 className="text-2xl font-bond mb-4">
                AlphabetButtonを使った動的テキスト表示
            </h2>

            {/* テキストボックス表示エリア　*/}
            <div
                className="
                border border-blue-500 p-4 min-h-20 mb-5 bg-blue-50
                rounded-md flex items-center justify-center text-xl font-bold
                text-gray-700 break-words"
                >
                {displayedText}
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
