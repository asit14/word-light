import { DocumentTab } from '../../types';

const RECOVERY_STORAGE_KEY = 'wordlite_recovery_snapshots_v1';
const MAX_SNAPSHOTS = 10;

export interface RecoverySnapshot {
  id: string;
  tabId: string;
  fileName: string;
  timestamp: number;
  contentJson: any;
  contentHtml: string;
  pageSettings: any;
}

export function saveRecoverySnapshot(tab: DocumentTab): void {
  try {
    const raw = localStorage.getItem(RECOVERY_STORAGE_KEY);
    let list: RecoverySnapshot[] = raw ? JSON.parse(raw) : [];

    // Filter out previous snapshot for the same tab to avoid endless duplicates
    list = list.filter((s) => s.tabId !== tab.id);

    const snapshot: RecoverySnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tabId: tab.id,
      fileName: tab.fileName,
      timestamp: Date.now(),
      contentJson: tab.contentJson,
      contentHtml: tab.contentHtml,
      pageSettings: tab.pageSettings,
    };

    list.unshift(snapshot);

    // Keep only most recent snapshots
    if (list.length > MAX_SNAPSHOTS) {
      list = list.slice(0, MAX_SNAPSHOTS);
    }

    localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save local recovery snapshot:', err);
  }
}

export function getRecoverySnapshots(): RecoverySnapshot[] {
  try {
    const raw = localStorage.getItem(RECOVERY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearRecoverySnapshot(tabId: string): void {
  try {
    const raw = localStorage.getItem(RECOVERY_STORAGE_KEY);
    if (!raw) return;
    const list: RecoverySnapshot[] = JSON.parse(raw);
    const updated = list.filter((s) => s.tabId !== tabId);
    localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to clear recovery snapshot:', err);
  }
}

export function clearAllRecoverySnapshots(): void {
  localStorage.removeItem(RECOVERY_STORAGE_KEY);
}
