import React from 'react';
import { X, Binary } from 'lucide-react';

interface SymbolPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
}

const COMMON_SYMBOLS = [
  '©', '®', '™', '§', '¶', '°', '±', '×', '÷', '≠',
  '≤', '≥', '≈', '≡', '∞', '√', '∑', '∫', '∆', 'µ',
  '€', '£', '¥', '¢', '₹', '₽', '₩', '•', '–', '—',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'π', 'σ', 'ω',
  '←', '→', '↑', '↓', '↔', '⇒', '⇔', '✓', '✗', '★',
];

export const SymbolPickerModal: React.FC<SymbolPickerModalProps> = ({
  isOpen,
  onClose,
  onInsertSymbol,
}) => {
  if (!isOpen) return null;

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog symbol-picker-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <Binary size={16} />
            <span>Special Characters & Symbols</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">Click any symbol to insert it directly into your document at the current cursor position:</p>
          <div className="symbols-grid">
            {COMMON_SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                className="symbol-card-btn"
                onClick={() => {
                  onInsertSymbol(symbol);
                  onClose();
                }}
                title={`Insert ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
