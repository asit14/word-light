# WordLite DOCX Interoperability & Compatibility Report

## 1. Executive Summary

WordLite implements robust, two-way Microsoft Word OpenXML (`.docx`) interoperability. The import pipeline utilizes `mammoth` alongside custom style and image handlers, while the export pipeline utilizes `docx` to serialize document structures into ECMA-376 compliant WordprocessingML packages.

---

## 2. Supported Features Matrix

| Feature | Import (.docx -> WordLite) | Export (WordLite -> .docx) | Status |
| :--- | :---: | :---: | :--- |
| **Headings (H1 to H6)** | Supported | Supported | Full fidelity (Heading 1-6 levels mapped) |
| **Paragraphs & Line Breaks** | Supported | Supported | Full fidelity |
| **Character Formatting** | | | |
| - Bold | Supported | Supported | Preserved |
| - Italic | Supported | Supported | Preserved |
| - Underline | Supported | Supported | Preserved |
| - Strikethrough | Supported | Supported | Preserved |
| - Superscript / Subscript | Supported | Supported | Preserved |
| - Font Colors | Supported | Supported | Hex colors preserved |
| - Text Highlights | Supported | Supported | Preserved |
| **Paragraph Formatting** | | | |
| - Alignment (Left, Center, Right, Justify) | Supported | Supported | Preserved |
| - Bulleted Lists | Supported | Supported | Preserved |
| - Numbered Lists | Supported | Supported | Preserved |
| **Tables** | Supported | Supported | Preserved (Rows, Columns, Headers, Cell padding) |
| **Images & Illustrations** | Supported | Supported | Preserved (Embedded images parsed to inline base64) |
| **Page Layout & Dimensions** | | | |
| - Paper Sizes (A4, Letter, Legal) | Supported | Supported | Twip-level conversion (A4: 11906 × 16838 twips) |
| - Orientation (Portrait, Landscape) | Supported | Supported | Explicit page section orientation |
| - Margins (Top, Bottom, Left, Right) | Supported | Supported | Twip millimeter conversion |
| **Headers & Footers** | Supported | Supported | Default header & footer sections with page number fields |
| **Page Breaks** | Supported | Supported | Hard `pageBreakBefore` paragraph flags |
| **Hyperlinks** | Supported | Supported | Preserved with URLs and display labels |
| **Footnotes & Endnotes** | Supported | Supported | Extracted and rendered |
| **Horizontal Rules** | Supported | Supported | Preserved as boundary paragraphs |

---

## 3. Test Methodology

The compatibility test suite (`src/__tests__/docx.test.ts`) verifies roundtrip processing:
1. Generate test documents with nested headings, tables, formatted text runs, and page setup rules.
2. Export structure via `exportToDocxBlob`.
3. Validate MIME type `application/vnd.openxmlformats-officedocument.wordprocessingml.document` and byte integrity.
4. Load the generated binary array buffer into `importDocxFromArrayBuffer`.
5. Verify DOM reconstruction matches semantic intent.

---

## 4. Known Limitations & Edge Cases

1. **VBA Macros (`.docm`):** WordLite explicitly disables execution of all embedded VBA macros, ActiveX controls, and script automation to ensure zero remote code execution vulnerabilities.
2. **Complex 3D Shapes & SmartArt:** Converted to flat vector/image previews or simplified shapes.
3. **Legacy Binary Word 97-2003 (`.doc`):** Users must convert binary files to `.docx` using standard converters before importing.
