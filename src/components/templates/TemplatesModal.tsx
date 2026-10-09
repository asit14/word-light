import React, { useState } from 'react';
import { X, LayoutTemplate, FileText } from 'lucide-react';
import { TEMPLATES, DocumentTemplate } from '../../templates/sampleDocuments';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'General', 'Career', 'Business', 'Academic'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog templates-modal-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <LayoutTemplate size={18} />
            <span>Document Templates Gallery</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close Gallery">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Category Filter Pills */}
          <div className="template-categories-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
              >
                <div className="template-card-preview">
                  <FileText size={32} className="template-icon" />
                  <span className="template-badge">{template.category}</span>
                </div>
                <div className="template-card-meta">
                  <h4 className="template-card-title">{template.name}</h4>
                  <p className="template-card-desc">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
