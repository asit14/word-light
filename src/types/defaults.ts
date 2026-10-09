import { PageSettings, DocumentStyle, PaperSize } from './document';

export const PAPER_DIMENSIONS: Record<PaperSize, { width: number; height: number; name: string }> = {
  A4: { width: 210, height: 297, name: 'A4 (210 × 297 mm)' },
  Letter: { width: 215.9, height: 279.4, name: 'Letter (8.5 × 11 in)' },
  Legal: { width: 215.9, height: 355.6, name: 'Legal (8.5 × 14 in)' },
  Executive: { width: 184.1, height: 266.7, name: 'Executive (7.25 × 10.5 in)' },
  A5: { width: 148, height: 210, name: 'A5 (148 × 210 mm)' },
  Custom: { width: 210, height: 297, name: 'Custom Size' },
};

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  size: 'A4',
  orientation: 'portrait',
  margins: {
    top: 25.4,    // 1 inch = 25.4 mm
    bottom: 25.4,
    left: 25.4,
    right: 25.4,
  },
  headerDistance: 12.7, // 0.5 inch
  footerDistance: 12.7,
  columns: 1,
  showRuler: true,
  showFormattingMarks: false,
  headerText: 'WordLite Document',
  footerText: '',
  pageNumberFormat: 'arabic',
  showPageNumbers: true,
  differentFirstPage: false,
};

export const MARGIN_PRESETS = [
  { name: 'Normal', top: 25.4, bottom: 25.4, left: 25.4, right: 25.4, desc: 'Top: 1" Bottom: 1" Left: 1" Right: 1"' },
  { name: 'Narrow', top: 12.7, bottom: 12.7, left: 12.7, right: 12.7, desc: 'Top: 0.5" Bottom: 0.5" Left: 0.5" Right: 0.5"' },
  { name: 'Moderate', top: 25.4, bottom: 25.4, left: 19.05, right: 19.05, desc: 'Top: 1" Bottom: 1" Left: 0.75" Right: 0.75"' },
  { name: 'Wide', top: 25.4, bottom: 25.4, left: 50.8, right: 50.8, desc: 'Top: 1" Bottom: 1" Left: 2" Right: 2"' },
];

export const FONT_FAMILIES = [
  { label: 'Calibri', value: 'Calibri, Aptos, sans-serif' },
  { label: 'Aptos', value: 'Aptos, Calibri, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Segoe UI', value: '"Segoe UI", system-ui, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Cascadia Code', value: '"Cascadia Code", Consolas, monospace' },
];

export const FONT_SIZES = [
  '8pt', '9pt', '10pt', '10.5pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '22pt', '24pt', '26pt', '28pt', '36pt', '48pt', '72pt'
];

export const DEFAULT_DOCUMENT_STYLES: DocumentStyle[] = [
  {
    id: 'normal',
    name: 'Normal',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '11pt',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000',
    lineHeight: '1.25',
  },
  {
    id: 'title',
    name: 'Title',
    fontFamily: 'Aptos, Calibri, sans-serif',
    fontSize: '28pt',
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#1b365d',
    lineHeight: '1.2',
  },
  {
    id: 'subtitle',
    name: 'Subtitle',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14pt',
    fontWeight: 'normal',
    fontStyle: 'italic',
    color: '#5c768d',
    lineHeight: '1.3',
  },
  {
    id: 'heading-1',
    name: 'Heading 1',
    fontFamily: 'Aptos, Calibri, sans-serif',
    fontSize: '18pt',
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#1b365d',
    lineHeight: '1.25',
    isHeading: true,
    headingLevel: 1,
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    fontFamily: 'Aptos, Calibri, sans-serif',
    fontSize: '14pt',
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#2e5b88',
    lineHeight: '1.3',
    isHeading: true,
    headingLevel: 2,
  },
  {
    id: 'heading-3',
    name: 'Heading 3',
    fontFamily: 'Aptos, Calibri, sans-serif',
    fontSize: '12pt',
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#3d6994',
    lineHeight: '1.3',
    isHeading: true,
    headingLevel: 3,
  },
  {
    id: 'quote',
    name: 'Quote',
    fontFamily: 'Georgia, serif',
    fontSize: '11pt',
    fontWeight: 'normal',
    fontStyle: 'italic',
    color: '#495057',
    lineHeight: '1.4',
  },
  {
    id: 'intense-quote',
    name: 'Intense Quote',
    fontFamily: 'Georgia, serif',
    fontSize: '12pt',
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#1b365d',
    lineHeight: '1.4',
  },
];
