import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Search,
  Replace,
  CheckSquare,
  Paintbrush,
  RemoveFormatting,
  Pilcrow,
} from 'lucide-react';
import { FONT_FAMILIES, FONT_SIZES, DEFAULT_DOCUMENT_STYLES } from '../../../types/defaults';

interface HomeTabProps {
  editor: any;
  onOpenFind: () => void;
  onOpenReplace: () => void;
  showFormattingMarks: boolean;
  onToggleFormattingMarks: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  editor,
  onOpenFind,
  onOpenReplace,
  showFormattingMarks,
  onToggleFormattingMarks,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<any>(null);

  if (!editor) {
    return <div className="ribbon-empty-tab">Loading editor controls...</div>;
  }

  // Active state queries
  const isBold = editor.isActive('bold');
  const isItalic = editor.isActive('italic');
  const isUnderline = editor.isActive('underline');
  const isStrike = editor.isActive('strike');
  const isSubscript = editor.isActive('subscript');
  const isSuperscript = editor.isActive('superscript');
  const isBulletList = editor.isActive('bulletList');
  const isOrderedList = editor.isActive('orderedList');

  const isAlignLeft = editor.isActive({ textAlign: 'left' });
  const isAlignCenter = editor.isActive({ textAlign: 'center' });
  const isAlignRight = editor.isActive({ textAlign: 'right' });
  const isAlignJustify = editor.isActive({ textAlign: 'justify' });

  // Get current font family and size
  const currentFont = editor.getAttributes('textStyle').fontFamily || 'Calibri, Aptos, sans-serif';
  const currentSize = editor.getAttributes('textStyle').fontSize || '11pt';

  // Format painter handler
  const handleCopyFormat = () => {
    const marks = editor.state.selection.$from.marks();
    setCopiedFormat(marks);
  };

  const handleApplyFormat = () => {
    if (!copiedFormat) return;
    editor.chain().focus();
    copiedFormat.forEach((mark: any) => {
      editor.commands.setMark(mark.type.name, mark.attrs);
    });
  };

  const handleGrowFont = () => {
    const idx = FONT_SIZES.indexOf(currentSize);
    if (idx < FONT_SIZES.length - 1) {
      editor.chain().focus().setFontSize(FONT_SIZES[idx + 1]).run();
    }
  };

  const handleShrinkFont = () => {
    const idx = FONT_SIZES.indexOf(currentSize);
    if (idx > 0) {
      editor.chain().focus().setFontSize(FONT_SIZES[idx - 1]).run();
    }
  };

  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  const applyStyle = (styleId: string) => {
    editor.chain().focus();
    switch (styleId) {
      case 'title':
        editor.commands.setHeading({ level: 1 });
        editor.commands.setFontSize('28pt');
        editor.commands.setColor('#1b365d');
        break;
      case 'subtitle':
        editor.commands.setParagraph();
        editor.commands.setFontSize('14pt');
        editor.commands.setItalic();
        editor.commands.setColor('#5c768d');
        break;
      case 'heading-1':
        editor.commands.setHeading({ level: 1 });
        editor.commands.setFontSize('18pt');
        editor.commands.setColor('#1b365d');
        break;
      case 'heading-2':
        editor.commands.setHeading({ level: 2 });
        editor.commands.setFontSize('14pt');
        editor.commands.setColor('#2e5b88');
        break;
      case 'heading-3':
        editor.commands.setHeading({ level: 3 });
        editor.commands.setFontSize('12pt');
        editor.commands.setColor('#3d6994');
        break;
      case 'quote':
        editor.commands.setBlockquote();
        editor.commands.setItalic();
        break;
      case 'intense-quote':
        editor.commands.setBlockquote();
        editor.commands.setBold();
        editor.commands.setColor('#1b365d');
        break;
      case 'normal':
      default:
        editor.commands.setParagraph();
        editor.commands.setFontSize('11pt');
        editor.commands.setColor('#000000');
        break;
    }
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group 1: Clipboard */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button
              className={`ribbon-small-btn ${copiedFormat ? 'active' : ''}`}
              onClick={copiedFormat ? handleApplyFormat : handleCopyFormat}
              title={copiedFormat ? 'Paste Formatting' : 'Format Painter (Copy Formatting)'}
            >
              <Paintbrush size={15} />
              <span>{copiedFormat ? 'Apply Painter' : 'Painter'}</span>
            </button>
            <button
              className="ribbon-small-btn"
              onClick={handleClearFormatting}
              title="Clear All Formatting"
            >
              <RemoveFormatting size={15} />
              <span>Clear</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Clipboard</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 2: Font */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-layout">
          {/* Top row: Font family, size, grow/shrink */}
          <div className="ribbon-row">
            <select
              className="ribbon-select font-family-select"
              value={currentFont}
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              title="Font Family"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              className="ribbon-select font-size-select"
              value={currentSize}
              onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
              title="Font Size"
            >
              {FONT_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button className="ribbon-icon-btn" onClick={handleGrowFont} title="Increase Font Size">
              A<span style={{ fontSize: '10px' }}>▲</span>
            </button>
            <button className="ribbon-icon-btn" onClick={handleShrinkFont} title="Decrease Font Size">
              A<span style={{ fontSize: '10px' }}>▼</span>
            </button>
          </div>

          {/* Bottom row: Bold, Italic, Underline, Strike, Sub, Super, Colors */}
          <div className="ribbon-row">
            <button
              className={`ribbon-icon-btn ${isBold ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl/Cmd + B)"
            >
              <Bold size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isItalic ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl/Cmd + I)"
            >
              <Italic size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isUnderline ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl/Cmd + U)"
            >
              <UnderlineIcon size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isStrike ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isSubscript ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              title="Subscript"
            >
              <SubscriptIcon size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isSuperscript ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              title="Superscript"
            >
              <SuperscriptIcon size={14} />
            </button>

            {/* Font Color Picker */}
            <label className="ribbon-color-picker-label" title="Font Color">
              <span className="font-color-indicator">A</span>
              <input
                type="color"
                className="ribbon-hidden-color-input"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>

            {/* Highlight Color Picker */}
            <label className="ribbon-color-picker-label highlight-label" title="Text Highlight Color">
              <span className="highlight-color-indicator">ab</span>
              <input
                type="color"
                defaultValue="#ffeb3b"
                className="ribbon-hidden-color-input"
                onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
              />
            </label>
          </div>
        </div>
        <div className="ribbon-group-label">Font</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 3: Paragraph */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-layout">
          {/* Top row: Lists, indents, formatting marks */}
          <div className="ribbon-row">
            <button
              className={`ribbon-icon-btn ${isBulletList ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullets"
            >
              <List size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isOrderedList ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbering"
            >
              <ListOrdered size={14} />
            </button>

            <button
              className="ribbon-icon-btn"
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
              title="Decrease Indent"
            >
              <Outdent size={14} />
            </button>

            <button
              className="ribbon-icon-btn"
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
              title="Increase Indent"
            >
              <Indent size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${showFormattingMarks ? 'active' : ''}`}
              onClick={onToggleFormattingMarks}
              title="Show/Hide Formatting Marks (¶)"
            >
              <Pilcrow size={14} />
            </button>
          </div>

          {/* Bottom row: Alignment & Line Spacing */}
          <div className="ribbon-row">
            <button
              className={`ribbon-icon-btn ${isAlignLeft ? 'active' : ''}`}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isAlignCenter ? 'active' : ''}`}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Center"
            >
              <AlignCenter size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isAlignRight ? 'active' : ''}`}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>

            <button
              className={`ribbon-icon-btn ${isAlignJustify ? 'active' : ''}`}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="Justify"
            >
              <AlignJustify size={14} />
            </button>

            <select
              className="ribbon-select line-height-select"
              onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
              defaultValue="1.25"
              title="Line and Paragraph Spacing"
            >
              <option value="1.0">1.0</option>
              <option value="1.15">1.15</option>
              <option value="1.25">1.25</option>
              <option value="1.5">1.5</option>
              <option value="2.0">2.0</option>
            </select>
          </div>
        </div>
        <div className="ribbon-group-label">Paragraph</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 4: Styles Gallery */}
      <div className="ribbon-group styles-gallery-group">
        <div className="ribbon-group-controls styles-scroll-strip">
          {DEFAULT_DOCUMENT_STYLES.map((style) => (
            <button
              key={style.id}
              className="style-gallery-card"
              onClick={() => applyStyle(style.id)}
              title={`Apply ${style.name} Style`}
            >
              <span
                className="style-card-preview"
                style={{
                  fontFamily: style.fontFamily,
                  color: style.color,
                  fontWeight: style.fontWeight as any,
                }}
              >
                {style.name}
              </span>
              <span className="style-card-name">{style.name}</span>
            </button>
          ))}
        </div>
        <div className="ribbon-group-label">Styles</div>
      </div>

      <div className="ribbon-group-separator" />

      {/* Group 5: Editing (Find, Replace, Select) */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-column">
            <button className="ribbon-small-btn" onClick={onOpenFind} title="Find (Ctrl/Cmd + F)">
              <Search size={14} />
              <span>Find</span>
            </button>
            <button className="ribbon-small-btn" onClick={onOpenReplace} title="Replace (Ctrl/Cmd + H)">
              <Replace size={14} />
              <span>Replace</span>
            </button>
            <button
              className="ribbon-small-btn"
              onClick={() => editor.chain().focus().selectAll().run()}
              title="Select All (Ctrl/Cmd + A)"
            >
              <CheckSquare size={14} />
              <span>Select All</span>
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Editing</div>
      </div>
    </div>
  );
};
