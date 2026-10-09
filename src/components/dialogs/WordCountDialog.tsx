import React from 'react';
import { X, FileSpreadsheet } from 'lucide-react';

interface WordCountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageCount: number;
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  paragraphCount: number;
  lineCount: number;
}

export const WordCountDialog: React.FC<WordCountDialogProps> = ({
  isOpen,
  onClose,
  pageCount,
  wordCount,
  charCount,
  charCountNoSpaces,
  paragraphCount,
  lineCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog word-count-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <FileSpreadsheet size={16} />
            <span>Word Count Statistics</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="stat-table">
            <div className="stat-row">
              <span className="stat-label">Pages:</span>
              <span className="stat-value">{Math.max(1, pageCount)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{wordCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Characters (no spaces):</span>
              <span className="stat-value">{charCountNoSpaces}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Characters (with spaces):</span>
              <span className="stat-value">{charCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Paragraphs:</span>
              <span className="stat-value">{paragraphCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Lines (approximate):</span>
              <span className="stat-value">{lineCount}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
