import React, { useState } from 'react';
import { X, GitCompare } from 'lucide-react';
import { diffWordsWithSpace, Change } from 'diff';

interface CompareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocumentHtml: string;
}

export const CompareDialog: React.FC<CompareDialogProps> = ({
  isOpen,
  onClose,
  currentDocumentHtml,
}) => {
  const [originalText, setOriginalText] = useState('');
  const [diffResults, setDiffResults] = useState<Change[] | null>(null);

  if (!isOpen) return null;

  // Convert HTML of current document to clean text
  const currentText = (() => {
    const temp = document.createElement('div');
    temp.innerHTML = currentDocumentHtml;
    return temp.innerText || '';
  })();

  const handleRunCompare = () => {
    const diff = diffWordsWithSpace(originalText, currentText);
    setDiffResults(diff);
  };

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog compare-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <GitCompare size={18} />
            <span>Compare Documents</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            Compare the current document against an earlier version or copied draft to see exact additions and deletions.
          </p>

          {!diffResults ? (
            <div className="compare-input-section">
              <label className="input-label">Paste Original / Previous Document Text:</label>
              <textarea
                rows={8}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste original version text here to compare..."
                className="compare-textarea"
              />
            </div>
          ) : (
            <div className="compare-diff-view">
              <div className="diff-legend">
                <span className="legend-tag legend-add">+ Added in Current</span>
                <span className="legend-tag legend-del">- Deleted from Original</span>
                <span className="legend-tag legend-same">Unchanged</span>
              </div>
              <div className="diff-rendered-box">
                {diffResults.map((part, index) => {
                  const colorClass = part.added
                    ? 'diff-part-added'
                    : part.removed
                    ? 'diff-part-removed'
                    : 'diff-part-normal';
                  return (
                    <span key={index} className={colorClass}>
                      {part.value}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {diffResults ? (
            <button className="btn btn-secondary" onClick={() => setDiffResults(null)}>
              Edit Inputs
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleRunCompare}
              disabled={!originalText.trim()}
            >
              Compare
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
