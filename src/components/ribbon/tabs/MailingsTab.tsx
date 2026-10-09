import React from 'react';
import {
  Mail,
  Users,
  FileCode,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

interface MailingsTabProps {
  onOpenMailMergeDialog: () => void;
  recipientCount: number;
  currentRecordIndex: number;
  onPrevRecord: () => void;
  onNextRecord: () => void;
  onInsertField: (fieldName: string) => void;
  availableFields: string[];
}

export const MailingsTab: React.FC<MailingsTabProps> = ({
  onOpenMailMergeDialog,
  recipientCount,
  currentRecordIndex,
  onPrevRecord,
  onNextRecord,
  onInsertField,
  availableFields,
}) => {
  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Start Mail Merge */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onOpenMailMergeDialog}
            title="Configure CSV Data Source and Mail Merge Template"
          >
            <Mail size={22} className="ribbon-large-icon" />
            <span>Start Mail Merge</span>
          </button>
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={onOpenMailMergeDialog}
              title="Select CSV Recipients File"
            >
              <Users size={14} />
              <span>Select Recipients</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Start Merge</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Insert Merge Fields */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <span className="ribbon-mini-label">Insert Field:</span>
            <div className="ribbon-row">
              {availableFields.length > 0 ? (
                <select
                  className="ribbon-select"
                  onChange={(e) => {
                    if (e.target.value) {
                      onInsertField(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  title="Choose a merge field to insert at cursor"
                >
                  <option value="" disabled>
                    Choose Field...
                  </option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>
                      «{field}»
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  className="ribbon-small-btn"
                  onClick={onOpenMailMergeDialog}
                  title="Load a CSV file to detect merge fields"
                >
                  <FileCode size={14} />
                  <span>Load CSV Fields</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="ribbon-group-label">Fields</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Preview Results */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <div className="ribbon-row" style={{ alignItems: 'center', gap: '6px' }}>
              <button
                className="ribbon-icon-btn"
                onClick={onPrevRecord}
                disabled={recipientCount === 0 || currentRecordIndex <= 0}
                title="Previous Record"
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>
                {recipientCount > 0 ? `Record ${currentRecordIndex + 1} of ${recipientCount}` : 'No CSV loaded'}
              </span>
              <button
                className="ribbon-icon-btn"
                onClick={onNextRecord}
                disabled={recipientCount === 0 || currentRecordIndex >= recipientCount - 1}
                title="Next Record"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <button
              className="ribbon-small-btn"
              onClick={onOpenMailMergeDialog}
              title="Finish and Generate Merged Output"
            >
              <Send size={14} />
              <span>Finish & Merge</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Preview & Finish</div>
      </div>
    </div>
  );
};
