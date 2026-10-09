import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { PageSettings, PaperSize, PageOrientation } from '../../types';

interface PageSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageSettings: PageSettings;
  onSave: (settings: Partial<PageSettings>) => void;
}

export const PageSetupDialog: React.FC<PageSetupDialogProps> = ({
  isOpen,
  onClose,
  pageSettings,
  onSave,
}) => {
  const [size, setSize] = useState<PaperSize>(pageSettings.size);
  const [orientation, setOrientation] = useState<PageOrientation>(pageSettings.orientation);
  const [top, setTop] = useState(pageSettings.margins.top);
  const [bottom, setBottom] = useState(pageSettings.margins.bottom);
  const [left, setLeft] = useState(pageSettings.margins.left);
  const [right, setRight] = useState(pageSettings.margins.right);
  const [headerDistance, setHeaderDistance] = useState(pageSettings.headerDistance);
  const [footerDistance, setFooterDistance] = useState(pageSettings.footerDistance);
  const [columns, setColumns] = useState<1 | 2 | 3>(pageSettings.columns);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      size,
      orientation,
      margins: { top, bottom, left, right },
      headerDistance,
      footerDistance,
      columns,
    });
    onClose();
  };

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog page-setup-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <Sliders size={16} />
            <span>Page Setup</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <h4>Margins (millimeters)</h4>
            <div className="grid-2x2">
              <div className="form-group">
                <label className="form-label">Top (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={top}
                  onChange={(e) => setTop(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bottom (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={bottom}
                  onChange={(e) => setBottom(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Left (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={left}
                  onChange={(e) => setLeft(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Right (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={right}
                  onChange={(e) => setRight(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>

            <h4 style={{ marginTop: '16px' }}>Paper & Orientation</h4>
            <div className="grid-2x2">
              <div className="form-group">
                <label className="form-label">Paper Size:</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as PaperSize)}
                  className="form-select"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">US Letter (8.5 × 11 in)</option>
                  <option value="Legal">US Legal (8.5 × 14 in)</option>
                  <option value="Executive">Executive</option>
                  <option value="A5">A5</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Orientation:</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                  className="form-select"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Columns:</label>
                <select
                  value={columns}
                  onChange={(e) => setColumns(parseInt(e.target.value) as any)}
                  className="form-select"
                >
                  <option value={1}>1 Column</option>
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Header Distance (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={headerDistance}
                  onChange={(e) => setHeaderDistance(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Footer Distance (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={footerDistance}
                  onChange={(e) => setFooterDistance(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              OK
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
