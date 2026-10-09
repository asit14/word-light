export type PaperSize = 'A4' | 'Letter' | 'Legal' | 'Executive' | 'A5' | 'Custom';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageMargins {
  top: number;    // in mm
  bottom: number; // in mm
  left: number;   // in mm
  right: number;  // in mm
}

export interface PageSettings {
  size: PaperSize;
  customWidth?: number;  // mm
  customHeight?: number; // mm
  orientation: PageOrientation;
  margins: PageMargins;
  headerDistance: number; // mm from top
  footerDistance: number; // mm from bottom
  columns: 1 | 2 | 3;
  showRuler: boolean;
  showFormattingMarks: boolean;
  headerText: string;
  footerText: string;
  pageNumberFormat: 'arabic' | 'roman' | 'alpha';
  showPageNumbers: boolean;
  differentFirstPage: boolean;
}

export interface DocumentComment {
  id: string;
  author: string;
  createdAt: string;
  text: string;
  selectedText?: string;
  fromPos?: number;
  toPos?: number;
  resolved: boolean;
  replies: {
    id: string;
    author: string;
    createdAt: string;
    text: string;
  }[];
}

export interface DocumentRevision {
  id: string;
  type: 'insertion' | 'deletion' | 'format';
  author: string;
  timestamp: string;
  description: string;
  content: string;
  accepted?: boolean;
}

export interface DocumentTab {
  id: string;
  filePath?: string;
  fileName: string;
  isModified: boolean;
  contentJson: any; // TipTap JSON
  contentHtml: string;
  pageSettings: PageSettings;
  comments: DocumentComment[];
  revisions: DocumentRevision[];
  trackingChanges: boolean;
  readOnly: boolean;
  createdAt: number;
  lastSavedAt?: number;
}

export type ViewMode = 'print' | 'draft' | 'read' | 'focus';
export type ActiveRibbonTab = 'file' | 'home' | 'insert' | 'layout' | 'references' | 'review' | 'mailings' | 'view';

export interface MailMergeRecord {
  [field: string]: string;
}

export interface DocumentStyle {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  lineHeight: string;
  isHeading?: boolean;
  headingLevel?: number;
}
