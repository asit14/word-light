import React, { useState } from 'react';
import { X, Footprints } from 'lucide-react';
import { PageSettings } from '../../types';

interface HeaderFooterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageSettings: PageSettings;
  onSave: (settings: Partial<PageSettings>) => void;
}

export const HeaderFooterDialog: React.FC<HeaderFooterDialogProps> = ({
  isOpen,
  onClose,
  pageSettings,
  onSave,
}) => {
  const [headerText, setHeaderText] = useState(pageSettings.headerText || '');
  const [footerText, setFooterText] = useState(pageSettings.footerText || '');
  const [showPageNumbers, setShowPageNumbers] = useState(pageSettings.showPageNumbers);
  const [pageNumberFormat, setPageNumberFormat] = useState(pageSettings.pageNumberFormat);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      headerText,
      footerText,
      showPageNumbers,
      pageNumberFormat,
    });
    onClose();
  };

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog header-footer-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <Footprints size={16} />
            <span>Header & Footer Settings</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Header Text:</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="e.g. Company Confidential | Document Title"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Footer Text:</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Confidential & Proprietary"
                className="form-input"
              />
            </div>

            <div className="checkbox-row" style={{ marginTop: '12px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={(e) => setShowPageNumbers(e.target.checked)}
                />
                <span>Show Page Numbers (Page X of Y) in Footer</span>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="form-label">Page Number Format:</label>
              <select
                value={pageNumberFormat}
                onChange={(e) => setPageNumberFormat(e.target.value as any)}
                className="form-select"
              >
                <option value="arabic">1, 2, 3 (Arabic numerals)</option>
                <option value="roman">i, ii, iii (Roman numerals)</option>
                <option value="alpha">a, b, c (Alphabetical)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Apply
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
