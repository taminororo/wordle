
'use client';

import React from 'react';
import AlphabetButton from './AlphabetButtons';

interface ResultModalProps {
  isSuccess: boolean;
  targetWord: string;
  translatedWord: string;
  onReset: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ isSuccess, targetWord, translatedWord, onReset }) => {
  const message = isSuccess ? '🎉クリア！🎉' : '残念！';

  return (
    <div className="result-modal-overlay">
      <div className="result-modal-content">
        <h2 className="result-modal-title">{message}</h2>
        <div className="result-modal-body">
          <p>正解は...</p>
          <p className="result-modal-word">{targetWord}</p>
          <p className="result-modal-translation">({translatedWord})</p>
        </div>
        <AlphabetButton label="もう一度プレイ" onButtonClick={onReset} />
      </div>
    </div>
  );
};

export default ResultModal;
