'use client';

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export const OcrPanel = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    try {
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: ({ progress: pct }) => setProgress(Math.round(pct * 100))
      });
      setText(data.text);
    } catch (error) {
      console.error(error);
      setText('OCR failed. Please try another document.');
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return (
    <section className="ocr-panel card">
      <header>
        <div>
          <span className="badge">OCR Engine</span>
          <h3>Policy Document Scanner</h3>
        </div>
      </header>
      <input type="file" accept="image/*,.pdf" onChange={handleFile} />
      {isProcessing && <div className="progress">Processing {progress}%</div>}
      {text && (
        <textarea value={text} readOnly rows={6} />
      )}
    </section>
  );
};

export default OcrPanel;
