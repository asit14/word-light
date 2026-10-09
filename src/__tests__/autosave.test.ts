import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveRecoverySnapshot,
  getRecoverySnapshots,
  clearRecoverySnapshot,
  clearAllRecoverySnapshots,
} from '../services/storage/autosave';
import { DocumentTab } from '../types';
import { DEFAULT_PAGE_SETTINGS } from '../types/defaults';

describe('Autosave & Crash Recovery System', () => {
  beforeEach(() => {
    clearAllRecoverySnapshots();
  });

  const sampleTab: DocumentTab = {
    id: 'test_tab_1',
    fileName: 'Quarterly Report.docx',
    isModified: true,
    contentJson: { type: 'doc', content: [] },
    contentHtml: '<p>Report draft content</p>',
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    comments: [],
    revisions: [],
    trackingChanges: false,
    readOnly: false,
    createdAt: Date.now(),
  };

  it('should save recovery snapshot and retrieve it from local storage', () => {
    saveRecoverySnapshot(sampleTab);
    const snapshots = getRecoverySnapshots();
    expect(snapshots.length).toBe(1);
    expect(snapshots[0].tabId).toBe('test_tab_1');
    expect(snapshots[0].fileName).toBe('Quarterly Report.docx');
    expect(snapshots[0].contentHtml).toBe('<p>Report draft content</p>');
  });

  it('should clear recovery snapshot when saved file is closed or saved', () => {
    saveRecoverySnapshot(sampleTab);
    expect(getRecoverySnapshots().length).toBe(1);

    clearRecoverySnapshot('test_tab_1');
    expect(getRecoverySnapshots().length).toBe(0);
  });

  it('should maintain maximum snapshot bounds without unbounded growth', () => {
    for (let i = 0; i < 15; i++) {
      saveRecoverySnapshot({
        ...sampleTab,
        id: `tab_${i}`,
        fileName: `Doc ${i}.docx`,
      });
    }

    const snapshots = getRecoverySnapshots();
    expect(snapshots.length).toBeLessThanOrEqual(10);
  });
});
