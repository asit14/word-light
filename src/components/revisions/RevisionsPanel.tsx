import React from 'react';
import { X, Check, CheckCheck, Trash2, GitCommit } from 'lucide-react';
import { DocumentRevision } from '../../types';

interface RevisionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: DocumentRevision[];
  onAcceptRevision: (id: string) => void;
  onRejectRevision: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

export const RevisionsPanel: React.FC<RevisionsPanelProps> = ({
  isOpen,
  onClose,
  revisions,
  onAcceptRevision,
  onRejectRevision,
  onAcceptAll,
  onRejectAll,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="wordlite-revisions-panel">
      <div className="revisions-header">
        <div className="revisions-title">
          <GitCommit size={16} />
          <span>Tracked Changes ({revisions.length})</span>
        </div>
        <button className="revisions-close-btn" onClick={onClose} title="Close Revisions Panel">
          <X size={14} />
        </button>
      </div>

      {revisions.length > 0 && (
        <div className="revisions-batch-actions">
          <button
            className="batch-btn accept-all-btn"
            onClick={onAcceptAll}
            title="Accept All Revisions"
          >
            <CheckCheck size={13} />
            <span>Accept All</span>
          </button>
          <button
            className="batch-btn reject-all-btn"
            onClick={onRejectAll}
            title="Reject All Revisions"
          >
            <Trash2 size={13} />
            <span>Reject All</span>
          </button>
        </div>
      )}

      <div className="revisions-list">
        {revisions.length === 0 ? (
          <div className="revisions-empty-state">
            No pending tracked changes. With Track Changes enabled in the Review tab, edits and formatting changes are recorded here.
          </div>
        ) : (
          revisions.map((rev) => (
            <div key={rev.id} className={`revision-card rev-${rev.type}`}>
              <div className="rev-header">
                <span className="rev-type-badge">{rev.type}</span>
                <span className="rev-author">{rev.author}</span>
                <span className="rev-time">{rev.timestamp}</span>
              </div>
              <div className="rev-desc">{rev.description}</div>
              {rev.content && <div className="rev-content-preview">{rev.content}</div>}

              <div className="rev-actions">
                <button
                  className="rev-action-btn accept-btn"
                  onClick={() => onAcceptRevision(rev.id)}
                  title="Accept this change"
                >
                  <Check size={12} /> Accept
                </button>
                <button
                  className="rev-action-btn reject-btn"
                  onClick={() => onRejectRevision(rev.id)}
                  title="Reject this change"
                >
                  <X size={12} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
