import React from 'react';
import {
  Save,
  Undo2,
  Redo2,
  FilePlus2,
  FolderOpen,
  Printer,
  Sun,
  Moon,
} from 'lucide-react';

interface QuickAccessToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onNew: () => void;
  onOpen: () => void;
  onPrint: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  docTitle: string;
  isModified: boolean;
}

export const QuickAccessToolbar: React.FC<QuickAccessToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onNew,
  onOpen,
  onPrint,
  theme,
  onToggleTheme,
  docTitle,
  isModified,
}) => {
  return (
    <div className="wordlite-top-window-bar">
      {/* Brand Icon & Quick Access Buttons */}
      <div className="qat-left-group">
        <div className="wordlite-brand-badge" title="WordLite Word Processor">
          <span className="brand-letter">W</span>
        </div>

        <div className="qat-button-strip" role="toolbar" aria-label="Quick Access Toolbar">
          <button
            className="qat-btn"
            onClick={onSave}
            title="Save Document (Ctrl/Cmd + S)"
            aria-label="Save"
          >
            <Save size={15} />
          </button>

          <button
            className="qat-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl/Cmd + Z)"
            aria-label="Undo"
          >
            <Undo2 size={15} />
          </button>

          <button
            className="qat-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl/Cmd + Y)"
            aria-label="Redo"
          >
            <Redo2 size={15} />
          </button>

          <div className="qat-divider" />

          <button
            className="qat-btn"
            onClick={onNew}
            title="New Document (Ctrl/Cmd + N)"
            aria-label="New"
          >
            <FilePlus2 size={15} />
          </button>

          <button
            className="qat-btn"
            onClick={onOpen}
            title="Open Document (Ctrl/Cmd + O)"
            aria-label="Open"
          >
            <FolderOpen size={15} />
          </button>

          <button
            className="qat-btn"
            onClick={onPrint}
            title="Print Document (Ctrl/Cmd + P)"
            aria-label="Print"
          >
            <Printer size={15} />
          </button>
        </div>
      </div>

      {/* Document Title Header */}
      <div className="qat-title-center">
        <span className="doc-title-text">{docTitle}</span>
        {isModified && <span className="doc-modified-indicator" title="Unsaved changes">●</span>}
        <span className="doc-app-name">— WordLite</span>
      </div>

      {/* Window Controls / Theme Switcher */}
      <div className="qat-right-group">
        <button
          className="qat-theme-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </div>
    </div>
  );
};
