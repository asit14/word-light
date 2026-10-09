import { invoke } from '@tauri-apps/api/core';
import { open as openDialog, save as saveDialog } from '@tauri-apps/plugin-dialog';
import { exportToDocxBlob } from './docxExporter';
import { importDocxFromArrayBuffer } from './docxImporter';
import { exportToPlainText, exportToMarkdown, exportToRtf, exportToHtmlFile } from './otherExporters';
import { PageSettings } from '../../types';

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export interface OpenedFile {
  name: string;
  path?: string;
  contentHtml: string;
  isDocx: boolean;
  warnings?: string[];
}

export async function openDocumentDialog(): Promise<OpenedFile | null> {
  if (isTauriEnvironment()) {
    try {
      const selected = await openDialog({
        multiple: false,
        filters: [
          {
            name: 'Supported Documents',
            extensions: ['docx', 'txt', 'html', 'htm', 'md', 'rtf'],
          },
          { name: 'Word Documents (*.docx)', extensions: ['docx'] },
          { name: 'Text Documents (*.txt)', extensions: ['txt'] },
          { name: 'Web Pages (*.html)', extensions: ['html', 'htm'] },
          { name: 'Markdown (*.md)', extensions: ['md'] },
        ],
      });

      if (!selected || typeof selected !== 'string') return null;

      const path = selected;
      const fileName = path.split(/[/\\]/).pop() || 'Document';
      const fileExt = fileName.split('.').pop()?.toLowerCase();

      // Read file binary from Rust
      const bytes: number[] = await invoke('read_document_file', { path });
      const uint8 = new Uint8Array(bytes);

      if (fileExt === 'docx') {
        const result = await importDocxFromArrayBuffer(uint8.buffer);
        return {
          name: fileName,
          path,
          contentHtml: result.html,
          isDocx: true,
          warnings: result.messages,
        };
      } else {
        const text = new TextDecoder().decode(uint8);
        return {
          name: fileName,
          path,
          contentHtml: fileExt === 'html' || fileExt === 'htm' ? text : `<pre>${text}</pre>`,
          isDocx: false,
        };
      }
    } catch (err) {
      console.error('Error opening file via Tauri dialog:', err);
      // Fallback to web input if Tauri dialog failed
    }
  }

  // Web fallback: Input file element
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.txt,.html,.htm,.md,.rtf';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'docx') {
        const buffer = await file.arrayBuffer();
        const result = await importDocxFromArrayBuffer(buffer);
        resolve({
          name: fileName,
          contentHtml: result.html,
          isDocx: true,
          warnings: result.messages,
        });
      } else {
        const text = await file.text();
        resolve({
          name: fileName,
          contentHtml: fileExt === 'html' || fileExt === 'htm' ? text : `<pre>${text}</pre>`,
          isDocx: false,
        });
      }
    };

    input.click();
  });
}

export async function saveDocumentFile(
  contentJson: any,
  _contentHtml: string,
  pageSettings: PageSettings,
  currentPath?: string,
  suggestedName = 'Document.docx'
): Promise<{ path?: string; saved: boolean }> {
  // Generate DOCX blob
  const docxBlob = await exportToDocxBlob(contentJson, pageSettings, suggestedName);
  const arrayBuffer = await docxBlob.arrayBuffer();
  const bytes = Array.from(new Uint8Array(arrayBuffer));

  if (isTauriEnvironment()) {
    try {
      let targetPath = currentPath;

      if (!targetPath) {
        const chosen = await saveDialog({
          defaultPath: suggestedName,
          filters: [
            { name: 'Word Document (*.docx)', extensions: ['docx'] },
          ],
        });
        if (!chosen || typeof chosen !== 'string') return { saved: false };
        targetPath = chosen;
      }

      // Atomic save via Rust command
      await invoke('write_document_file_atomic', {
        path: targetPath,
        data: bytes,
      });

      return { path: targetPath, saved: true };
    } catch (err) {
      console.error('Error saving file in Tauri:', err);
    }
  }

  // Web fallback: trigger browser download
  downloadBlob(docxBlob, suggestedName);
  return { saved: true };
}

export async function exportDocumentAs(
  format: 'docx' | 'txt' | 'md' | 'rtf' | 'html',
  contentJson: any,
  contentHtml: string,
  pageSettings: PageSettings,
  baseFileName = 'Document'
): Promise<void> {
  const cleanBase = baseFileName.replace(/\.[^/.]+$/, '');

  switch (format) {
    case 'docx': {
      const blob = await exportToDocxBlob(contentJson, pageSettings, cleanBase);
      downloadBlob(blob, `${cleanBase}.docx`);
      break;
    }
    case 'txt': {
      const text = exportToPlainText(contentHtml);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, `${cleanBase}.txt`);
      break;
    }
    case 'md': {
      const md = exportToMarkdown(contentHtml);
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      downloadBlob(blob, `${cleanBase}.md`);
      break;
    }
    case 'rtf': {
      const plain = exportToPlainText(contentHtml);
      const rtf = exportToRtf(plain);
      const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
      downloadBlob(blob, `${cleanBase}.rtf`);
      break;
    }
    case 'html': {
      const htmlFile = exportToHtmlFile(contentHtml, cleanBase);
      const blob = new Blob([htmlFile], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, `${cleanBase}.html`);
      break;
    }
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function revealFileInOs(filePath: string): Promise<void> {
  if (isTauriEnvironment() && filePath) {
    try {
      await invoke('reveal_in_file_manager', { path: filePath });
    } catch (err) {
      console.warn('Could not reveal in OS file manager:', err);
    }
  }
}
