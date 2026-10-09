import React from 'react';
import {
  Columns as ColumnsIcon,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';
import { PageSettings, PaperSize, PageOrientation } from '../../../types';
import { MARGIN_PRESETS } from '../../../types/defaults';

interface LayoutTabProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (settings: Partial<PageSettings>) => void;
  onOpenPageSetup: () => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  pageSettings,
  onUpdatePageSettings,
  onOpenPageSetup,
}) => {
  const handleMarginPreset = (preset: typeof MARGIN_PRESETS[0]) => {
    onUpdatePageSettings({
      margins: {
        top: preset.top,
        bottom: preset.bottom,
        left: preset.left,
        right: preset.right,
      },
    });
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Page Setup (Margins, Orientation, Size) */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-layout">
          <div className="ribbon-row">
            {/* Margins Dropdown */}
            <select
              className="ribbon-select"
              value={
                pageSettings.margins.top === 12.7
                  ? 'Narrow'
                  : pageSettings.margins.left === 50.8
                  ? 'Wide'
                  : 'Normal'
              }
              onChange={(e) => {
                const found = MARGIN_PRESETS.find((p) => p.name === e.target.value);
                if (found) handleMarginPreset(found);
              }}
              title="Page Margins"
            >
              <option value="Normal">Normal Margins (1")</option>
              <option value="Narrow">Narrow Margins (0.5")</option>
              <option value="Moderate">Moderate Margins (0.75")</option>
              <option value="Wide">Wide Margins (2")</option>
            </select>

            {/* Orientation */}
            <select
              className="ribbon-select"
              value={pageSettings.orientation}
              onChange={(e) =>
                onUpdatePageSettings({ orientation: e.target.value as PageOrientation })
              }
              title="Orientation"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div className="ribbon-row">
            {/* Paper Size */}
            <select
              className="ribbon-select"
              value={pageSettings.size}
              onChange={(e) =>
                onUpdatePageSettings({ size: e.target.value as PaperSize })
              }
              title="Paper Size"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
              <option value="Legal">Legal (8.5 × 14 in)</option>
              <option value="Executive">Executive (7.25 × 10.5 in)</option>
              <option value="A5">A5 (148 × 210 mm)</option>
            </select>

            <button
              className="ribbon-small-btn"
              onClick={onOpenPageSetup}
              title="Detailed Page Setup & Margins Dialog"
            >
              <Sliders size={13} />
              <span>Custom Setup</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Page Setup</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Columns */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className={`ribbon-small-btn ${pageSettings.columns === 1 ? 'active' : ''}`}
              onClick={() => onUpdatePageSettings({ columns: 1 })}
              title="Single Column Layout"
            >
              <FileSpreadsheet size={14} />
              <span>One Column</span>
            </button>
            <button
              className={`ribbon-small-btn ${pageSettings.columns === 2 ? 'active' : ''}`}
              onClick={() => onUpdatePageSettings({ columns: 2 })}
              title="Two Columns Layout"
            >
              <ColumnsIcon size={14} />
              <span>Two Columns</span>
            </button>
          </div>
          <div className="ribbon-btn-column">
            <button
              className={`ribbon-small-btn ${pageSettings.columns === 3 ? 'active' : ''}`}
              onClick={() => onUpdatePageSettings({ columns: 3 })}
              title="Three Columns Layout"
            >
              <ColumnsIcon size={14} />
              <span>Three Columns</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Columns</div>
      </div>
    </div>
  );
};
