import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle, Trash2, RotateCcw } from 'lucide-react';
import { DocumentComment } from '../../types';

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  onAddComment: (text: string) => void;
  onReplyComment: (commentId: string, replyText: string) => void;
  onToggleResolve: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onReplyComment,
  onToggleResolve,
  onDeleteComment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim());
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;
    onReplyComment(commentId, text);
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  return (
    <aside className="wordlite-comments-sidebar">
      <div className="comments-header">
        <div className="comments-title">
          <MessageSquare size={16} />
          <span>Comments ({comments.length})</span>
        </div>
        <button className="comments-close-btn" onClick={onClose} title="Close Comments Sidebar">
          <X size={14} />
        </button>
      </div>

      {/* New comment input form */}
      <form onSubmit={handleCreate} className="new-comment-form">
        <textarea
          placeholder="Add a comment to this document..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          rows={2}
          className="comment-textarea"
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!newCommentText.trim()}
          title="Post Comment"
        >
          <Send size={13} />
          <span>Post</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty-state">
            No comments yet. Highlight text and click "New Comment" in Review tab or enter a note above.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment-card ${comment.resolved ? 'resolved' : ''}`}
            >
              {comment.selectedText && (
                <div className="comment-quote-anchor">
                  "{comment.selectedText}"
                </div>
              )}

              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-time">{comment.createdAt}</span>
              </div>

              <div className="comment-body">{comment.text}</div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies-list">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment-reply-item">
                      <div className="reply-meta">
                        <span className="reply-author">{reply.author}</span>
                        <span className="reply-time">{reply.createdAt}</span>
                      </div>
                      <div className="reply-body">{reply.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="reply-input-row">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendReply(comment.id);
                    }
                  }}
                  className="reply-text-input"
                />
              </div>

              {/* Action buttons */}
              <div className="comment-actions">
                <button
                  className="comment-action-btn"
                  onClick={() => onToggleResolve(comment.id)}
                  title={comment.resolved ? 'Reopen Comment' : 'Resolve Comment'}
                >
                  {comment.resolved ? (
                    <>
                      <RotateCcw size={12} /> Reopen
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} /> Resolve
                    </>
                  )}
                </button>
                <button
                  className="comment-action-btn text-danger"
                  onClick={() => onDeleteComment(comment.id)}
                  title="Delete Comment"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
