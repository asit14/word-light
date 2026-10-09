import React from 'react';
import {
  FileText,
  BookOpen,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Moon,
  Sun,
  LayoutTemplate,
} from 'lucide-react';
import { ViewMode } from '../../../types';

interface ViewTabProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showNavigationPane: boolean;
  onToggleNavigationPane: () => void;
  showFormattingMarks: boolean;
  onToggleFormattingMarks: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onViewModeChange,
  showRuler,
  onToggleRuler,
  showNavigationPane,
  onToggleNavigationPane,
  showFormattingMarks,
  onToggleFormattingMarks,
  zoom,
  onZoomChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Views */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-large-btn ${viewMode === 'print' ? 'active' : ''}`}
            onClick={() => onViewModeChange('print')}
            title="Print Layout (Standard Paginated View)"
          >
            <FileText size={22} className="ribbon-large-icon" />
            <span>Print Layout</span>
          </button>

          <div className="ribbon-btn-column">
            <button
              className={`ribbon-small-btn ${viewMode === 'draft' ? 'active' : ''}`}
              onClick={() => onViewModeChange('draft')}
              title="Draft View (Continuous flow)"
            >
              <LayoutTemplate size={14} />
              <span>Draft</span>
            </button>
            <button
              className={`ribbon-small-btn ${viewMode === 'read' ? 'active' : ''}`}
              onClick={() => onViewModeChange('read')}
              title="Read Mode"
            >
              <BookOpen size={14} />
              <span>Read Mode</span>
            </button>
            <button
              className={`ribbon-small-btn ${viewMode === 'focus' ? 'active' : ''}`}
              onClick={() => onViewModeChange('focus')}
              title="Focus Mode (Full Screen Distraction-Free)"
            >
              <Maximize2 size={14} />
              <span>Focus Mode</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Views</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Show / Hide */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <label className="ribbon-checkbox-label">
              <input
                type="checkbox"
                checked={showRuler}
                onChange={onToggleRuler}
              />
              <span>Ruler</span>
            </label>
            <label className="ribbon-checkbox-label">
              <input
                type="checkbox"
                checked={showNavigationPane}
                onChange={onToggleNavigationPane}
              />
              <span>Navigation Pane</span>
            </label>
            <label className="ribbon-checkbox-label">
              <input
                type="checkbox"
                checked={showFormattingMarks}
                onChange={onToggleFormattingMarks}
              />
              <span>Formatting Marks (¶)</span>
            </label>
          </div>
        </div>
        <div className="ribbon-group-label">Show</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Zoom */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={() => onZoomChange(1.0)}
            title="Set Zoom to 100%"
          >
            <Maximize size={22} className="ribbon-large-icon" />
            <span>100%</span>
          </button>
          <div className="ribbon-btn-column">
            <div className="ribbon-row">
              <button
                className="ribbon-icon-btn"
                onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                className="ribbon-icon-btn"
                onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
            </div>
            <select
              className="ribbon-select"
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              title="Zoom Level"
            >
              <option value="0.5">50%</option>
              <option value="0.75">75%</option>
              <option value="1.0">100%</option>
              <option value="1.25">125%</option>
              <option value="1.5">150%</option>
              <option value="2.0">200%</option>
            </select>
          </div>
        </div>
        <div className="ribbon-group-label">Zoom</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 4: Window & Appearance */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onToggleTheme}
            title="Toggle Light or Dark Theme"
          >
            {theme === 'light' ? (
              <Moon size={22} className="ribbon-large-icon" />
            ) : (
              <Sun size={22} className="ribbon-large-icon" />
            )}
            <span>{theme === 'light' ? 'Dark Theme' : 'Light Theme'}</span>
          </button>
        </div>
        <div className="ribbon-group-label">Window</div>
      </div>
    </div>
  );
};
