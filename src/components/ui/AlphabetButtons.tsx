'use client';

type AlphabetButtonProps = {
  label: string;
  onButtonClick: (label: string) => void;
  colorClass?: string;
  disabled?: boolean; // ★ disabled プロパティを追加
};

export default function AlphabetButton({ label, onButtonClick, colorClass = 'bg-stone-300', disabled = false }: AlphabetButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onButtonClick(label);
    }
  }

  // ★ disabled状態に応じてスタイルを動的に変更
  const buttonClasses = `
    text-black text-base font-normal font-sans
    px-4 py-2
    rounded-sm transition-colors duration-200
    ${disabled
      ? 'opacity-70 cursor-not-allowed' // disabled時のスタイル
      : 'hover:bg-stone-400 active:bg-stone-500' // 通常時のスタイル
    }
  `;

  return (
    <div className={` ${colorClass} rounded-sm inline-flex flex-col justify-center items-center`}>
        <button 
          className={buttonClasses}
          onClick={handleClick}
          disabled={disabled} // ★ button要素にdisabled属性を渡す
        >
            {label}
        </button>
    </div>
  )
}
