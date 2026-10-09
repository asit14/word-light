import React, { useState } from 'react';
import { X, Mail, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { MailMergeRecord } from '../../types';

interface MailMergeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: MailMergeRecord[], fields: string[]) => void;
  records: MailMergeRecord[];
  fields: string[];
  currentDocumentHtml: string;
}

export const MailMergeDialog: React.FC<MailMergeDialogProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  records,
  fields,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  if (!isOpen) return null;

  const handleParseCsv = (raw: string) => {
    Papa.parse<MailMergeRecord>(raw, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError(`CSV Warning: ${results.errors[0].message}`);
        } else {
          setParseError(null);
        }

        if (results.data.length > 0) {
          const detectedFields = Object.keys(results.data[0]);
          onDataLoaded(results.data, detectedFields);
        }
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCsvText(reader.result);
        handleParseCsv(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const sampleCsv = `FirstName,LastName,Email,Company,City
Alexander,Wright,alexander@example.com,CloudScale Labs,San Francisco
Catherine,Sterling,catherine@example.com,Vertex Corp,New York
David,Miller,david@example.com,Pinnacle Logistics,Chicago`;

  const handleLoadSample = () => {
    setCsvText(sampleCsv);
    handleParseCsv(sampleCsv);
  };

  const currentRecord = records[previewIndex];

  return (
    <div className="wordlite-modal-backdrop">
      <div className="wordlite-modal-dialog mailmerge-dialog">
        <div className="modal-header">
          <div className="modal-title">
            <Mail size={18} />
            <span>Mail Merge Wizard</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            Load recipient data from CSV to merge personalized details into letters, invoices, and certificates.
          </p>

          <div className="mailmerge-step-box">
            <h4>Step 1: Choose CSV Recipients</h4>
            <div className="csv-actions-row">
              <label className="btn btn-secondary upload-csv-label">
                <Upload size={14} />
                <span>Upload CSV File</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <button className="btn btn-secondary" onClick={handleLoadSample}>
                Load Sample Data (3 Records)
              </button>
            </div>

            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                handleParseCsv(e.target.value);
              }}
              placeholder="Or paste CSV content with column headers here..."
              className="csv-textarea"
            />

            {parseError && <div className="text-warning-msg">{parseError}</div>}
          </div>

          {records.length > 0 && (
            <div className="mailmerge-step-box">
              <h4>
                Step 2: Loaded Recipients ({records.length} Records, {fields.length} Fields)
              </h4>
              <div className="detected-fields-list">
                {fields.map((f) => (
                  <span key={f} className="detected-field-badge">
                    «{f}»
                  </span>
                ))}
              </div>

              <div className="record-preview-bar">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                  disabled={previewIndex <= 0}
                >
                  Previous
                </button>
                <span className="record-index-label">
                  Record {previewIndex + 1} of {records.length}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewIndex(Math.min(records.length - 1, previewIndex + 1))}
                  disabled={previewIndex >= records.length - 1}
                >
                  Next
                </button>
              </div>

              {currentRecord && (
                <div className="record-card-view">
                  <div className="record-fields-grid">
                    {Object.entries(currentRecord).map(([key, val]) => (
                      <div key={key} className="record-field-row">
                        <strong>{key}:</strong> <span>{String(val ?? '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
