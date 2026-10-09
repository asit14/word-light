import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Printer,
  Info,
  X,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import { DocumentTab } from '../../../types';
import { revealFileInOs } from '../../../services/file/fileManager';

interface FileTabProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DocumentTab;
  onNewBlank: () => void;
  onOpenTemplates: () => void;
  onOpenFile: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onExport: (format: 'docx' | 'txt' | 'md' | 'rtf' | 'html') => void;
  onPrint: () => void;
  onCloseDocument: () => void;
  wordCount: number;
  charCount: number;
}

export const FileTab: React.FC<FileTabProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNewBlank,
  onOpenTemplates,
  onOpenFile,
  onSave,
  onSaveAs,
  onExport,
  onPrint,
  onCloseDocument,
  wordCount,
  charCount,
}) => {
  const [activeSection, setActiveSection] = useState<'info' | 'new' | 'export' | 'print'>('info');

  if (!isOpen) return null;

  return (
    <div className="wordlite-backstage-overlay">
      {/* Left Backstage Navigation Menu */}
      <div className="backstage-sidebar">
        <button className="backstage-back-btn" onClick={onClose} title="Return to Document">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="backstage-nav-list">
          <button
            className={`backstage-nav-item ${activeSection === 'info' ? 'active' : ''}`}
            onClick={() => setActiveSection('info')}
          >
            <Info size={16} />
            <span>Info</span>
          </button>

          <button
            className={`backstage-nav-item ${activeSection === 'new' ? 'active' : ''}`}
            onClick={() => setActiveSection('new')}
          >
            <FilePlus size={16} />
            <span>New</span>
          </button>

          <button
            className="backstage-nav-item"
            onClick={() => {
              onOpenFile();
              onClose();
            }}
          >
            <FolderOpen size={16} />
            <span>Open</span>
          </button>

          <button
            className="backstage-nav-item"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            <Save size={16} />
            <span>Save</span>
          </button>

          <button
            className="backstage-nav-item"
            onClick={() => {
              onSaveAs();
              onClose();
            }}
          >
            <FileCheck size={16} />
            <span>Save As</span>
          </button>

          <button
            className={`backstage-nav-item ${activeSection === 'export' ? 'active' : ''}`}
            onClick={() => setActiveSection('export')}
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          <button
            className={`backstage-nav-item ${activeSection === 'print' ? 'active' : ''}`}
            onClick={() => setActiveSection('print')}
          >
            <Printer size={16} />
            <span>Print</span>
          </button>

          <div className="backstage-separator" />

          <button
            className="backstage-nav-item text-danger"
            onClick={() => {
              onCloseDocument();
              onClose();
            }}
          >
            <X size={16} />
            <span>Close Document</span>
          </button>
        </div>
      </div>

      {/* Right Backstage Content Area */}
      <div className="backstage-content-area">
        {/* Info Section */}
        {activeSection === 'info' && (
          <div className="backstage-pane">
            <h1 className="backstage-title">Document Information</h1>
            <div className="backstage-card-grid">
              <div className="backstage-card">
                <h3>Properties</h3>
                <div className="info-property-row">
                  <span className="prop-name">File Name:</span>
                  <span className="prop-val">{activeTab.fileName}</span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Status:</span>
                  <span className="prop-val">
                    {activeTab.isModified ? 'Unsaved changes' : 'Saved'}
                  </span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Words:</span>
                  <span className="prop-val">{wordCount}</span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Characters:</span>
                  <span className="prop-val">{charCount}</span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Paper Size:</span>
                  <span className="prop-val">{activeTab.pageSettings.size}</span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Orientation:</span>
                  <span className="prop-val">{activeTab.pageSettings.orientation}</span>
                </div>
                {activeTab.filePath && (
                  <div className="info-property-row">
                    <span className="prop-name">Path:</span>
                    <span className="prop-val file-path-text">{activeTab.filePath}</span>
                    <button
                      className="reveal-btn"
                      onClick={() => revealFileInOs(activeTab.filePath!)}
                      title="Reveal in File Manager"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                )}
              </div>

              <div className="backstage-card">
                <h3>Protection & Recovery</h3>
                <p className="card-desc">
                  WordLite automatically keeps snapshots in local storage for crash recovery.
                </p>
                <div className="info-property-row">
                  <span className="prop-name">Protection:</span>
                  <span className="prop-val">
                    {activeTab.readOnly ? 'Read-Only Mode' : 'Editable'}
                  </span>
                </div>
                <div className="info-property-row">
                  <span className="prop-name">Track Changes:</span>
                  <span className="prop-val">
                    {activeTab.trackingChanges ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Section */}
        {activeSection === 'new' && (
          <div className="backstage-pane">
            <h1 className="backstage-title">Create New Document</h1>
            <div className="new-template-strip">
              <button
                className="template-card-btn"
                onClick={() => {
                  onNewBlank();
                  onClose();
                }}
              >
                <div className="template-preview-box">
                  <FileText size={32} />
                </div>
                <span className="template-name">Blank Document</span>
              </button>

              <button
                className="template-card-btn"
                onClick={() => {
                  onOpenTemplates();
                  onClose();
                }}
              >
                <div className="template-preview-box template-gallery-box">
                  <FilePlus size={32} />
                </div>
                <span className="template-name">Templates Gallery (10 Templates)...</span>
              </button>
            </div>
          </div>
        )}

        {/* Export Section */}
        {activeSection === 'export' && (
          <div className="backstage-pane">
            <h1 className="backstage-title">Export Document</h1>
            <p className="card-desc">
              Choose an output format to export your document cleanly without cloud dependencies.
            </p>

            <div className="export-options-list">
              <div
                className="export-card"
                onClick={() => {
                  onExport('docx');
                  onClose();
                }}
              >
                <div className="export-badge">DOCX</div>
                <div className="export-info">
                  <h4>Microsoft Word Document (.docx)</h4>
                  <p>Standard OpenXML format preserving headings, fonts, tables, margins and headers.</p>
                </div>
              </div>

              <div
                className="export-card"
                onClick={() => {
                  onPrint();
                  onClose();
                }}
              >
                <div className="export-badge badge-pdf">PDF</div>
                <div className="export-info">
                  <h4>Adobe PDF Document (.pdf)</h4>
                  <p>Preserves exact page layout, margins, and typography via high-fidelity print output.</p>
                </div>
              </div>

              <div
                className="export-card"
                onClick={() => {
                  onExport('md');
                  onClose();
                }}
              >
                <div className="export-badge">MD</div>
                <div className="export-info">
                  <h4>Markdown (.md)</h4>
                  <p>Clean lightweight markup formatted for developers, notes, and documentation.</p>
                </div>
              </div>

              <div
                className="export-card"
                onClick={() => {
                  onExport('rtf');
                  onClose();
                }}
              >
                <div className="export-badge">RTF</div>
                <div className="export-info">
                  <h4>Rich Text Format (.rtf)</h4>
                  <p>Standard rich text format compatible with older word processors.</p>
                </div>
              </div>

              <div
                className="export-card"
                onClick={() => {
                  onExport('html');
                  onClose();
                }}
              >
                <div className="export-badge">HTML</div>
                <div className="export-info">
                  <h4>Web Page (.html)</h4>
                  <p>Self-contained HTML file viewable in all web browsers.</p>
                </div>
              </div>

              <div
                className="export-card"
                onClick={() => {
                  onExport('txt');
                  onClose();
                }}
              >
                <div className="export-badge">TXT</div>
                <div className="export-info">
                  <h4>Plain Text (.txt)</h4>
                  <p>Unformatted raw text for simple storage and terminal viewing.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print Section */}
        {activeSection === 'print' && (
          <div className="backstage-pane">
            <h1 className="backstage-title">Print Document</h1>
            <div className="print-action-box">
              <button
                className="print-primary-btn"
                onClick={() => {
                  onPrint();
                  onClose();
                }}
              >
                <Printer size={20} />
                <span>Print Document</span>
              </button>
              <p className="card-desc">
                Sends the paginated document directly to your operating system's native print dialog.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
