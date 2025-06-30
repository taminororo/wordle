'use client';

//import { useState } from 'react';

type AlphabetButtonProps = {
  label: string;
  onButtonClick: (label: string) => void;
  colorClass?: string; // ★色のクラスを任意プロパティとして追加
};

export default function AlphabetButton({ label, onButtonClick, colorClass = 'bg-stone-300' }: AlphabetButtonProps) {
  const handleClick = () => {
    onButtonClick(label);
  }
  return (
    <div className={` ${colorClass} rounded-sm inline-flex flex-col justify-center items-center`}>
        <button className="text-black text-base font-normal font-sans
        px-4 py-2
        hover:bg-stone-400 active:bg-stone-500 rounded-sm transition-colors duration-200
        "
          onClick={handleClick}
        >
            {label}
        </button>
    </div>
  )
}
