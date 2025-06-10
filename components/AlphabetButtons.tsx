'use client';

import { useState } from 'react';

type AlphabetButtonProps = {
  label: string;
  //　ボタンがクリックされたときに呼び出される関数をonButtonClickとして受け取る
  onButtonClick: (label: string)  => void;
};

export default function AlphabetButton({ label, onButtonClick }: AlphabetButtonProps) {
  // AlphabetButton自身のstateは不要になるため削除します
  //const [text, setText] = useState('');

  const handleClick = () =>  {
    //setText( label );
    //　ボタンがクリックされたら、親から渡されたonButtonClick関数に
    //　このボタンのlabelを渡して実行します
    onButtonClick(label);
  }
  return (
    <div className=" bg-stone-300 rounded-sm inline-flex flex-col justify-center items-center">
        <button className="text-black text-base font-normal font-sans
        px-4 py-2 /* パディングを追加してクリック可能な領域を広げる */
        hover:bg-stone-400 active:bg-stone-500 rounded-sm transition-colors duration-200
        "
          onClick={handleClick}
        >
            {label}
        </button>
    </div>
  )
}
