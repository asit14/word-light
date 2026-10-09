import React from 'react';
import {
  ListTree,
  RefreshCw,
  BookmarkPlus,
  Quote,
  FileText,
} from 'lucide-react';

interface ReferencesTabProps {
  editor?: any;
  onInsertTableOfContents: () => void;
  onInsertFootnote: () => void;
  onInsertCaption: () => void;
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  editor: _editor,
  onInsertTableOfContents,
  onInsertFootnote,
  onInsertCaption,
}) => {
  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Table of Contents */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onInsertTableOfContents}
            title="Generate Automatic Table of Contents from Document Headings"
          >
            <ListTree size={22} className="ribbon-large-icon" />
            <span>Table of Contents</span>
          </button>
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={onInsertTableOfContents}
              title="Refresh and Update Table of Contents"
            >
              <RefreshCw size={14} />
              <span>Update Table</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Table of Contents</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Footnotes */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={onInsertFootnote}
              title="Insert Footnote Reference"
            >
              <BookmarkPlus size={14} />
              <span>Insert Footnote</span>
            </button>
            <button
              className="ribbon-small-btn"
              onClick={onInsertFootnote}
              title="Insert Endnote Reference"
            >
              <FileText size={14} />
              <span>Insert Endnote</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Footnotes</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Captions */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onInsertCaption}
            title="Insert Numbered Figure or Table Caption"
          >
            <Quote size={22} className="ribbon-large-icon" />
            <span>Insert Caption</span>
          </button>
        </div>
        <div className="ribbon-group-label">Captions</div>
      </div>
    </div>
  );
};
