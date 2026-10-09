import { describe, it, expect } from 'vitest';
import {
  exportToPlainText,
  exportToMarkdown,
  exportToRtf,
  exportToHtmlFile,
} from '../services/file/otherExporters';

describe('Multi-Format Exporters', () => {
  const sampleHtml = `
    <h1>Document Title</h1>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <ul>
      <li>First list item</li>
      <li>Second list item</li>
    </ul>
    <blockquote>Important note inside quote</blockquote>
  `;

  it('should export clean plain text stripping HTML tags', () => {
    const plain = exportToPlainText(sampleHtml);
    expect(plain).toContain('Document Title');
    expect(plain).toContain('This is a paragraph with bold and italic text.');
    expect(plain).toContain('First list item');
    expect(plain).not.toContain('<h1>');
    expect(plain).not.toContain('<strong>');
  });

  it('should export valid Markdown syntax', () => {
    const md = exportToMarkdown(sampleHtml);
    expect(md).toContain('# Document Title');
    expect(md).toContain('**bold**');
    expect(md).toContain('*italic*');
    expect(md).toContain('> Important note inside quote');
  });

  it('should generate valid RTF document structure', () => {
    const plain = exportToPlainText(sampleHtml);
    const rtf = exportToRtf(plain);
    expect(rtf).toContain('{\\rtf1\\ansi');
    expect(rtf).toContain('\\fonttbl');
    expect(rtf).toContain('Document Title');
    expect(rtf.endsWith('}\n') || rtf.endsWith('}')).toBe(true);
  });

  it('should generate standalone valid HTML document with embedded styles', () => {
    const htmlFile = exportToHtmlFile(sampleHtml, 'My Report');
    expect(htmlFile).toContain('<!DOCTYPE html>');
    expect(htmlFile).toContain('<title>My Report</title>');
    expect(htmlFile).toContain('<h1>Document Title</h1>');
  });
});
