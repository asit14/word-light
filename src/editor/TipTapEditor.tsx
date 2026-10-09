import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';

import { PageBreak } from './extensions/pageBreak';
import { FontSize } from './extensions/fontSize';
import { LineHeight } from './extensions/lineHeight';
import { DocumentTab } from '../types';

interface TipTapEditorProps {
  tab: DocumentTab;
  onUpdate: (contentJson: any, contentHtml: string) => void;
  onEditorReady: (editor: any) => void;
  onSaveShortcut?: () => void;
  onFindShortcut?: () => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  tab,
  onUpdate,
  onEditorReady,
  onSaveShortcut,
  onFindShortcut,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      LineHeight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'wordlite-link',
        },
      }),
      CharacterCount,
      PageBreak,
    ],
    content: tab.contentHtml || tab.contentJson || '<p></p>',
    editable: !tab.readOnly,
    editorProps: {
      attributes: {
        class: 'wordlite-prosemirror-canvas',
        spellcheck: 'true',
      },
      handleKeyDown: (_view, event) => {
        // Handle shortcuts
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? event.metaKey : event.ctrlKey;

        if (modKey && event.key.toLowerCase() === 's') {
          event.preventDefault();
          if (onSaveShortcut) onSaveShortcut();
          return true;
        }

        if (modKey && event.key.toLowerCase() === 'f') {
          event.preventDefault();
          if (onFindShortcut) onFindShortcut();
          return true;
        }

        if (modKey && event.key === 'Enter') {
          event.preventDefault();
          editor?.commands.setPageBreak();
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON();
      const html = ed.getHTML();
      onUpdate(json, html);
    },
  });

  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Update content if tab content changes externally (e.g. template applied or file loaded)
  useEffect(() => {
    if (editor && tab.contentHtml && editor.getHTML() !== tab.contentHtml) {
      editor.commands.setContent(tab.contentHtml, { emitUpdate: false });
    }
  }, [tab.contentHtml, editor]);

  // Handle read-only changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!tab.readOnly);
    }
  }, [tab.readOnly, editor]);

  return <EditorContent editor={editor} className="wordlite-editor-content-wrapper" />;
};
