import React, { useState } from 'react';
import { X, Search, ListTree, FileText } from 'lucide-react';

interface HeadingItem {
  level: number;
  text: string;
  pos: number;
}

interface NavigationPaneProps {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [navTab, setNavTab] = useState<'headings' | 'pages'>('headings');
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  // Extract headings from editor document
  const headings: HeadingItem[] = [];
  if (editor && editor.state && editor.state.doc) {
    editor.state.doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'heading') {
        const text = node.textContent;
        if (text) {
          headings.push({
            level: node.attrs.level || 1,
            text,
            pos,
          });
        }
      }
    });
  }

  const filteredHeadings = headings.filter((h) =>
    h.text.toLowerCase().includes(filterText.toLowerCase())
  );

  const jumpToHeading = (pos: number) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos).scrollIntoView().run();
  };

  return (
    <aside className="wordlite-navigation-pane">
      <div className="nav-pane-header">
        <span className="nav-pane-title">Navigation</span>
        <button className="nav-pane-close" onClick={onClose} title="Close Navigation Pane">
          <X size={14} />
        </button>
      </div>

      {/* Search filter input */}
      <div className="nav-search-bar">
        <Search size={14} className="nav-search-icon" />
        <input
          type="text"
          placeholder="Search headings..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="nav-search-input"
        />
        {filterText && (
          <button className="nav-clear-search" onClick={() => setFilterText('')}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Tabs: Headings vs Pages */}
      <div className="nav-tabs-strip">
        <button
          className={`nav-tab-btn ${navTab === 'headings' ? 'active' : ''}`}
          onClick={() => setNavTab('headings')}
        >
          <ListTree size={13} />
          <span>Headings ({filteredHeadings.length})</span>
        </button>
        <button
          className={`nav-tab-btn ${navTab === 'pages' ? 'active' : ''}`}
          onClick={() => setNavTab('pages')}
        >
          <FileText size={13} />
          <span>Pages</span>
        </button>
      </div>

      {/* Headings Outline View */}
      <div className="nav-pane-content">
        {navTab === 'headings' && (
          <div className="headings-outline-list">
            {filteredHeadings.length === 0 ? (
              <div className="nav-empty-msg">
                {headings.length === 0
                  ? 'No headings found in this document. Apply Heading 1, 2, or 3 styles to populate outline.'
                  : 'No matching headings.'}
              </div>
            ) : (
              filteredHeadings.map((h, i) => (
                <div
                  key={i}
                  className={`heading-nav-item level-${h.level}`}
                  onClick={() => jumpToHeading(h.pos)}
                  title={`Heading ${h.level}: ${h.text}`}
                  style={{ paddingLeft: `${(h.level - 1) * 14 + 10}px` }}
                >
                  <span className="heading-marker">H{h.level}</span>
                  <span className="heading-title-text">{h.text}</span>
                </div>
              ))
            )}
          </div>
        )}

        {navTab === 'pages' && (
          <div className="pages-thumbnail-list">
            <div className="page-thumb-card active">
              <div className="thumb-paper">
                <span className="thumb-snippet">Page 1</span>
              </div>
              <span className="thumb-label">1</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
