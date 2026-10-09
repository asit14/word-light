import React, { useRef } from 'react';
import {
  Table as TableIcon,
  Image as ImageIcon,
  Link2,
  FileMinus,
  FilePlus2,
  Calendar,
  Split,
  Plus,
  Trash2,
  Minus,
  Binary,
  Footprints,
} from 'lucide-react';

interface InsertTabProps {
  editor: any;
  onOpenLinkDialog: () => void;
  onOpenHeaderFooter: () => void;
  onOpenSymbolPicker: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  editor,
  onOpenLinkDialog,
  onOpenHeaderFooter,
  onOpenSymbolPicker,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const isInsideTable = editor.isActive('table');

  const handleInsertTable = (rows = 3, cols = 3) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        editor.chain().focus().setImage({ src: reader.result }).run();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInsertDate = () => {
    const formatted = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    editor.chain().focus().insertContent(formatted).run();
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Pages (Blank Page & Page Break) */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={() => editor.chain().focus().insertBlankPage().run()}
            title="Add a new blank page anywhere in your document"
          >
            <FilePlus2 size={22} className="ribbon-large-icon" />
            <span>Blank Page</span>
          </button>
          <button
            className="ribbon-large-btn"
            onClick={() => editor.chain().focus().setPageBreak().run()}
            title="End the current page and move to the next page (Ctrl/Cmd + Enter)"
          >
            <FileMinus size={22} className="ribbon-large-icon" />
            <span>Page Break</span>
          </button>
        </div>
        <div className="ribbon-group-label">Pages</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Tables */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={() => handleInsertTable(3, 3)}
              title="Insert 3x3 Table"
            >
              <TableIcon size={14} />
              <span>Insert Table</span>
            </button>

            {isInsideTable && (
              <>
                <div className="ribbon-row">
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    title="Add Row Below"
                  >
                    <Plus size={12} /> Row
                  </button>
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    title="Delete Current Row"
                  >
                    <Minus size={12} /> Row
                  </button>
                </div>
                <div className="ribbon-row">
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    title="Add Column Right"
                  >
                    <Plus size={12} /> Col
                  </button>
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    title="Delete Current Column"
                  >
                    <Minus size={12} /> Col
                  </button>
                </div>
              </>
            )}
          </div>

          {isInsideTable && (
            <div className="ribbon-btn-column">
              <button
                className="ribbon-small-btn"
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
                title="Merge or Split Selected Cells"
              >
                <Split size={14} />
                <span>Merge/Split</span>
              </button>
              <button
                className="ribbon-small-btn text-danger"
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete Table"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
        <div className="ribbon-group-label">Tables</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Illustrations */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleImageUpload}
          />
          <button
            className="ribbon-large-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Insert Picture from Local File"
          >
            <ImageIcon size={22} className="ribbon-large-icon" />
            <span>Pictures</span>
          </button>
          <button
            className="ribbon-large-btn"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Insert Horizontal Line"
          >
            <Minus size={22} className="ribbon-large-icon" />
            <span>Horizontal Line</span>
          </button>
        </div>
        <div className="ribbon-group-label">Illustrations</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 4: Links */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onOpenLinkDialog}
            title="Insert or Edit Hyperlink (Ctrl/Cmd + K)"
          >
            <Link2 size={22} className="ribbon-large-icon" />
            <span>Hyperlink</span>
          </button>
        </div>
        <div className="ribbon-group-label">Links</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 5: Header & Footer */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-large-btn"
            onClick={onOpenHeaderFooter}
            title="Configure Header, Footer, and Page Numbers"
          >
            <Footprints size={22} className="ribbon-large-icon" />
            <span>Header & Footer</span>
          </button>
        </div>
        <div className="ribbon-group-label">Header & Footer</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 6: Text & Symbols */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className="ribbon-small-btn"
              onClick={handleInsertDate}
              title="Insert Current Date"
            >
              <Calendar size={14} />
              <span>Date & Time</span>
            </button>
            <button
              className="ribbon-small-btn"
              onClick={onOpenSymbolPicker}
              title="Insert Special Symbol or Equation Symbol"
            >
              <Binary size={14} />
              <span>Symbol & Math</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Symbols</div>
      </div>
    </div>
  );
};
