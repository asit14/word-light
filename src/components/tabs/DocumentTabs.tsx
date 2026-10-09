import React from 'react';
import { DocumentTab } from '../../types';
import { X, Plus, FileText } from 'lucide-react';

interface DocumentTabsProps {
  tabs: DocumentTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div className="wordlite-doc-tab-strip" role="tablist" aria-label="Open Documents">
      <div className="doc-tabs-list">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={`doc-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              title={tab.filePath || tab.fileName}
            >
              <FileText size={13} className="doc-tab-icon" />
              <span className="doc-tab-title">{tab.fileName}</span>
              {tab.isModified && <span className="doc-tab-modified-dot" title="Unsaved changes">●</span>}
              <button
                className="doc-tab-close-btn"
                onClick={(e) => onCloseTab(tab.id, e)}
                title="Close Tab"
                aria-label={`Close ${tab.fileName}`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="new-tab-btn"
        onClick={onNewTab}
        title="Open New Blank Document (Ctrl/Cmd + N)"
        aria-label="New Document"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
