import React from 'react';
import {
  MessageSquarePlus,
  MessageSquare,
  CheckCircle,
  GitCommit,
  GitCompare,
  Lock,
  Unlock,
  SpellCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ReviewTabProps {
  onAddComment: () => void;
  onToggleCommentsSidebar: () => void;
  showCommentsSidebar: boolean;
  trackingChanges: boolean;
  onToggleTracking: () => void;
  onOpenRevisionsPanel: () => void;
  onOpenCompare: () => void;
  readOnly: boolean;
  onToggleReadOnly: () => void;
  onOpenWordCount: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onAddComment,
  onToggleCommentsSidebar,
  showCommentsSidebar,
  trackingChanges,
  onToggleTracking,
  onOpenRevisionsPanel,
  onOpenCompare,
  readOnly,
  onToggleReadOnly,
  onOpenWordCount,
}) => {
  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Proofing */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={onOpenWordCount}
              title="Display Word, Character, and Paragraph Count"
            >
              <FileSpreadsheet size={14} />
              <span>Word Count</span>
            </button>
            <button
              className="ribbon-small-btn"
              onClick={() => alert('Offline spellcheck is active with native dictionary checking.')}
              title="Check Spelling and Grammar"
            >
              <SpellCheck size={14} />
              <span>Check Spelling</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Proofing</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Comments */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onAddComment}
            title="Add a Comment to Selected Text"
          >
            <MessageSquarePlus size={22} className="ribbon-large-icon" />
            <span>New Comment</span>
          </button>
          <div className="ribbon-btn-column">
            <button
              className={`ribbon-small-btn ${showCommentsSidebar ? 'active' : ''}`}
              onClick={onToggleCommentsSidebar}
              title="Toggle Comments Sidebar"
            >
              <MessageSquare size={14} />
              <span>Show Comments</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Comments</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Tracking & Revisions */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-large-btn ${trackingChanges ? 'active' : ''}`}
            onClick={onToggleTracking}
            title="Track Changes (Audit document edits)"
          >
            <GitCommit size={22} className="ribbon-large-icon" />
            <span>{trackingChanges ? 'Tracking ON' : 'Track Changes'}</span>
          </button>
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={onOpenRevisionsPanel}
              title="Review Revision History and Accept/Reject Changes"
            >
              <CheckCircle size={14} />
              <span>Review Changes</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Tracking</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 4: Compare & Protect */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onOpenCompare}
            title="Compare Two Document Versions and Highlight Differences"
          >
            <GitCompare size={22} className="ribbon-large-icon" />
            <span>Compare</span>
          </button>
          <button
            className={`ribbon-large-btn ${readOnly ? 'active' : ''}`}
            onClick={onToggleReadOnly}
            title={readOnly ? 'Document is Protected (Click to Unlock)' : 'Protect Document as Read-Only'}
          >
            {readOnly ? (
              <Lock size={22} className="ribbon-large-icon text-danger" />
            ) : (
              <Unlock size={22} className="ribbon-large-icon" />
            )}
            <span>{readOnly ? 'Read-Only' : 'Protect'}</span>
          </button>
        </div>
        <div className="ribbon-group-label">Protect</div>
      </div>
    </div>
  );
};
