import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { RecoverySnapshot } from '../../services/storage/autosave';

interface RecoveryPromptProps {
  snapshots: RecoverySnapshot[];
  onRestore: (snapshot: RecoverySnapshot) => void;
  onDismiss: () => void;
}

export const RecoveryPrompt: React.FC<RecoveryPromptProps> = ({
  snapshots,
  onRestore,
  onDismiss,
}) => {
  if (snapshots.length === 0) return null;

  return (
    <div className="wordlite-recovery-banner" role="alert">
      <div className="recovery-banner-content">
        <AlertTriangle size={18} className="recovery-banner-icon" />
        <div className="recovery-banner-text">
          <strong>Document Recovery:</strong> WordLite detected unsaved document session(s) from a previous shutdown.
        </div>
      </div>

      <div className="recovery-banner-actions">
        {snapshots.slice(0, 2).map((s) => (
          <button
            key={s.id}
            className="recovery-restore-btn"
            onClick={() => onRestore(s)}
            title={`Restore ${s.fileName}`}
          >
            <RotateCcw size={13} />
            <span>Restore "{s.fileName}"</span>
          </button>
        ))}
        <button className="recovery-dismiss-btn" onClick={onDismiss} title="Dismiss Recovery">
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
