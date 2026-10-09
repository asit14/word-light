import React, { useState } from 'react';
import { X, Search, Replace as ReplaceIcon } from 'lucide-react';

interface FindReplaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  initialMode?: 'find' | 'replace';
}

export const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  isOpen,
  onClose,
  editor,
  initialMode = 'find',
}) => {
  const [mode, setMode] = useState<'find' | 'replace'>(initialMode);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleFind = () => {
    if (!editor || !findText) return;
    const docText = editor.state.doc.textContent;
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? 'g' : 'gi'
    );
    const matches = Array.from(docText.matchAll(regex));
    if (matches.length > 0) {
      setStatusMessage(`Found ${matches.length} matches.`);
    } else {
      setStatusMessage('No matches found.');
    }
  };

  const handleReplaceAll = () => {
    if (!editor || !findText) return;
    const currentHtml = editor.getHTML();
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      matchCase ? 'g' : 'gi'
    );
    const matchCount = (currentHtml.match(regex) || []).length;
    if (matchCount > 0) {
      const updated = currentHtml.replace(regex, replaceText);
      editor.commands.setContent(updated);
      setStatusMessage(`Replaced ${matchCount} occurrences.`);
    } else {
      setStatusMessage('No occurrences found to replace.');
    }
  };

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog find-replace-dialog">
        <div className="modal-header">
          <div className="modal-title">
            {mode === 'find' ? <Search size={16} /> : <ReplaceIcon size={16} />}
            <span>{mode === 'find' ? 'Find in Document' : 'Find and Replace'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-tabs-strip">
          <button
            className={`modal-tab-btn ${mode === 'find' ? 'active' : ''}`}
            onClick={() => setMode('find')}
          >
            Find
          </button>
          <button
            className={`modal-tab-btn ${mode === 'replace' ? 'active' : ''}`}
            onClick={() => setMode('replace')}
          >
            Replace
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Find what:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Enter search term..."
              className="form-input"
              autoFocus
            />
          </div>

          {mode === 'replace' && (
            <div className="form-group">
              <label className="form-label">Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Enter replacement text..."
                className="form-input"
              />
            </div>
          )}

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
              />
              <span>Match case</span>
            </label>
          </div>

          {statusMessage && <div className="status-feedback-msg">{statusMessage}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleFind} disabled={!findText}>
            Find Next
          </button>
          {mode === 'replace' && (
            <button className="btn btn-primary" onClick={handleReplaceAll} disabled={!findText}>
              Replace All
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
