import { describe, it, expect } from 'vitest';
import { exportToDocxBlob } from '../services/file/docxExporter';
import { importDocxFromArrayBuffer } from '../services/file/docxImporter';
import { DEFAULT_PAGE_SETTINGS } from '../types/defaults';

describe('DOCX Export & Import Interoperability', () => {
  it('should export rich text tipTap document to a valid binary DOCX blob', async () => {
    const tipTapDoc = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1, textAlign: 'left' },
          content: [{ type: 'text', text: 'Executive Project Overview' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'This document tests ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'bold formatting' },
            { type: 'text', text: ' and ' },
            { type: 'text', marks: [{ type: 'italic' }], text: 'italic styles' },
            { type: 'text', text: '.' },
          ],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Feature' }] }],
                },
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Status' }] }],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'DOCX Engine' }] }],
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Passing' }] }],
                },
              ],
            },
          ],
        },
      ],
    };

    const blob = await exportToDocxBlob(tipTapDoc, DEFAULT_PAGE_SETTINGS, 'TestDoc');
    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(1000);
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    // Test importing the generated DOCX back into HTML
    const arrayBuffer = await blob.arrayBuffer();
    const imported = await importDocxFromArrayBuffer(arrayBuffer);
    expect(imported).toBeDefined();
    expect(imported.html).toContain('Executive Project Overview');
    expect(imported.html).toContain('bold formatting');
    expect(imported.html).toContain('Feature');
  });

  it('should handle empty document without errors', async () => {
    const emptyDoc = { type: 'doc', content: [] };
    const blob = await exportToDocxBlob(emptyDoc, DEFAULT_PAGE_SETTINGS, 'Empty');
    expect(blob.size).toBeGreaterThan(500);
  });
});
