import React, { useState } from 'react';
import { X, Link2, Trash2 } from 'lucide-react';

interface HyperlinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
}

export const HyperlinkDialog: React.FC<HyperlinkDialogProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !url) return;

    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl) && !/^mailto:/i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    if (text && editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${targetUrl}">${text}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: targetUrl }).run();
    }
    onClose();
  };

  const handleRemove = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
    onClose();
  };

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog hyperlink-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <Link2 size={16} />
            <span>Insert Hyperlink</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleApply}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Link Address (URL):</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-input"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Display Text (optional):</label>
              <input
                type="text"
                placeholder="Text to display..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            {editor?.isActive('link') && (
              <button
                type="button"
                className="btn btn-secondary text-danger"
                onClick={handleRemove}
                title="Remove Hyperlink"
              >
                <Trash2 size={13} />
                <span>Remove Link</span>
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={!url.trim()}>
              Insert Link
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
