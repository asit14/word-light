import React from 'react';
import { ViewMode } from '../types';
import {
  FileText,
  BookOpen,
  Maximize2,
  Minus,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface StatusBarProps {
  pageCount: number;
  currentPage?: number;
  wordCount: number;
  charCount: number;
  isModified: boolean;
  isSaving: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onWordCountClick: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  pageCount,
  currentPage = 1,
  wordCount,
  charCount,
  isModified,
  isSaving,
  viewMode,
  onViewModeChange,
  zoom,
  onZoomChange,
  onWordCountClick,
}) => {
  // Estimated reading time (~200 words per minute)
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(parseFloat(e.target.value));
  };

  const handleZoomMinus = () => {
    onZoomChange(Math.max(0.5, Math.round((zoom - 0.1) * 10) / 10));
  };

  const handleZoomPlus = () => {
    onZoomChange(Math.min(2.0, Math.round((zoom + 0.1) * 10) / 10));
  };

  return (
    <footer className="wordlite-status-bar" role="status">
      {/* Left items: Page & Word statistics */}
      <div className="status-bar-left">
        <span className="status-item page-stat">
          Page {currentPage} of {Math.max(1, pageCount)}
        </span>

        <button
          className="status-item-button word-stat"
          onClick={onWordCountClick}
          title={`Click to view detailed document statistics (${charCount} characters)`}
        >
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </button>

        <span className="status-item reading-time" title="Estimated reading time">
          <Clock size={12} className="inline-icon" />
          {wordCount > 0 ? `~${readingTimeMin} min read` : '0 min'}
        </span>

        <span className="status-item language-proof">
          <CheckCircle2 size={12} className="inline-icon proof-icon" />
          English (United States)
        </span>

        {/* Save Status */}
        <span className="status-item save-status">
          {isSaving ? (
            <span className="status-saving">Saving...</span>
          ) : isModified ? (
            <span className="status-modified" title="Unsaved changes">
              <AlertCircle size={12} className="inline-icon" /> Unsaved changes
            </span>
          ) : (
            <span className="status-saved">Saved</span>
          )}
        </span>
      </div>

      {/* Right items: View modes & Zoom controls */}
      <div className="status-bar-right">
        {/* View Mode Switchers */}
        <div className="view-mode-group" role="group" aria-label="Document view modes">
          <button
            className={`view-mode-btn ${viewMode === 'read' ? 'active' : ''}`}
            onClick={() => onViewModeChange('read')}
            title="Read Mode"
          >
            <BookOpen size={14} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'print' ? 'active' : ''}`}
            onClick={() => onViewModeChange('print')}
            title="Print Layout"
          >
            <FileText size={14} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'focus' ? 'active' : ''}`}
            onClick={() => onViewModeChange('focus')}
            title="Focus Mode (Distraction-Free)"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Zoom Slider and Controls */}
        <div className="zoom-controls-group">
          <button
            className="zoom-btn"
            onClick={handleZoomMinus}
            disabled={zoom <= 0.5}
            title="Zoom Out"
          >
            <Minus size={13} />
          </button>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={zoom}
            onChange={handleZoomSlider}
            className="zoom-slider"
            title={`Zoom: ${Math.round(zoom * 100)}%`}
          />

          <button
            className="zoom-btn"
            onClick={handleZoomPlus}
            disabled={zoom >= 2.0}
            title="Zoom In"
          >
            <Plus size={13} />
          </button>

          <button
            className="zoom-percent-badge"
            onClick={() => onZoomChange(1.0)}
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
        </div>
      </div>
    </footer>
  );
};
