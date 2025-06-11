'use client'; // ← イベントハンドラを使うなら必須（App Routerの場合）

import { useState } from 'react';

export default function MyButtonComponent({ label }: { label: string}) {
  const [text, setText] = useState('');

  const handleClick = () => {
    setText( label );
  };

  return (
    <div className="p-4 border rounded">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleClick}
      >
        表示する
      </button>
      <input
        type="text"
        value={text}
        readOnly
        className="mt-2 border p-2 w-full"
      />
    </div>
  );
}
