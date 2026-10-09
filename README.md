# WordLite — Lightweight Desktop Word Processor

WordLite is a production-quality, high-performance desktop word processor for **macOS and Windows**, engineered to provide the essential features of Microsoft Word while remaining exceptionally fast and usable on low-end computers with only **2 GB of system RAM**.

<p align="center">
  <a href="https://raw.githubusercontent.com/asit14/word-light/main/WordLite.dmg">
    <img src="https://img.shields.io/badge/Download%20for%20macOS-WordLite.dmg%20(2.4%20MB)-000000?style=for-the-badge&logo=apple&logoColor=white" alt="Download WordLite for macOS" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://raw.githubusercontent.com/asit14/word-light/main/WordLite.exe">
    <img src="https://img.shields.io/badge/Download%20for%20Windows-WordLite.exe%20(4.9%20MB)-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Download WordLite for Windows" />
  </a>
</p>

---

## 📥 Downloads & Installation

Click the download buttons below to download the native application directly to your computer:

| Platform | Download Link | File Size | Instructions |
| :--- | :--- | :--- | :--- |
| **macOS** | [⬇️ **Download WordLite.dmg**](https://raw.githubusercontent.com/asit14/word-light/main/WordLite.dmg) | **2.4 MB** | 1. Click download to get `WordLite.dmg`<br>2. Double-click the downloaded `.dmg`<br>3. Drag **WordLite** into your **Applications** folder |
| **Windows** | [⬇️ **Download WordLite.exe**](https://raw.githubusercontent.com/asit14/word-light/main/WordLite.exe) | **4.9 MB** | 1. Click download to get `WordLite.exe`<br>2. Double-click `WordLite.exe` to launch immediately (no installer required) |

> **Note:** Direct raw download mirrors are also available:
> - macOS Mirror: [github.com/.../WordLite.dmg](https://github.com/asit14/word-light/raw/main/WordLite.dmg)
> - Windows Mirror: [github.com/.../WordLite.exe](https://github.com/asit14/word-light/raw/main/WordLite.exe)


## Key Highlights

- **Lightweight Architecture:** Powered by **Tauri 2 (Rust)** and **React 19 + TypeScript + Vite**, utilizing OS-native WebViews (WKWebView on macOS, WebView2 on Windows) instead of bundled Chromium runtimes.
- **Low Memory Footprint:** Idle memory of **~84 MB RSS** and normal editing memory under **120 MB**, fitting comfortably within strict 2 GB RAM constraints.
- **DOCX Interoperability:** High-fidelity import and export for Microsoft Word (`.docx`) files with headings, tables, formatting, margins, and headers/footers.
- **Paginated Page Layout:** True page canvas (A4, Letter, Legal, etc.) with custom margins, interactive ruler, headers, footers, and page numbers.
- **Complete Local Workflow:** 100% offline-first. No mandatory user account, no cloud database, no tracking telemetry, and zero background network requests.
- **Atomic File Operations & Recovery:** Atomic filesystem writes with automated local crash recovery snapshots.
- **Built-in Templates:** 10 editable templates including Resume, Cover Letter, Business Letter, Meeting Minutes, Project Report, Academic Assignment, Research Paper, Invoice, and Business Proposal.
- **Professional Review & Automation:** Comments, Track Changes (audit insertions/deletions), Document Compare (diff tool), and CSV Mail Merge.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Desktop Shell** | Tauri 2.12 (Rust 1.97) |
| **Frontend Framework** | React 19 + TypeScript 6.0 |
| **Bundler & Dev Server**| Vite 8.3 |
| **Rich Text Engine** | TipTap 3.31 + ProseMirror |
| **DOCX Serialization** | `docx` (OpenXML generator) |
| **DOCX Parsing** | `mammoth` |
| **Data Automation** | `papaparse` (CSV Mail Merge) |
| **Diff Engine** | `diff` (Document comparator) |
| **Icons & UI** | `lucide-react` |
| **Test Suite** | Vitest 5.0 + jsdom |

---

## Project Structure

```
.
├── src/
│   ├── types/                     # Document types, page settings, and styling defaults
│   │   ├── document.ts
│   │   ├── defaults.ts
│   │   └── index.ts
│   ├── editor/                    # TipTap and ProseMirror integration
│   │   ├── extensions/            # Custom extensions (PageBreak, FontSize, LineHeight)
│   │   └── TipTapEditor.tsx
│   ├── layout/                    # Paginated Canvas, Ruler, and Status Bar
│   │   ├── PageCanvas.tsx
│   │   ├── Ruler.tsx
│   │   └── StatusBar.tsx
│   ├── components/
│   │   ├── ribbon/                # Microsoft Word-style Ribbon toolbar
│   │   │   ├── Ribbon.tsx
│   │   │   ├── QuickAccessToolbar.tsx
│   │   │   └── tabs/              # File, Home, Insert, Layout, References, Review, Mailings, View
│   │   ├── tabs/                  # Multiple document tabs strip
│   │   ├── navigation/            # Document Map / Headings Navigation Pane
│   │   ├── comments/              # Threaded comments sidebar
│   │   ├── revisions/             # Track Changes review panel
│   │   ├── compare/               # Document comparison diff dialog
│   │   ├── mailmerge/             # CSV Mail Merge wizard
│   │   ├── templates/             # 10 document templates gallery
│   │   └── dialogs/               # Find/Replace, PageSetup, HeaderFooter, Symbols, WordCount, etc.
│   ├── services/
│   │   ├── file/                  # fileManager, docxExporter, docxImporter, otherExporters
│   │   └── storage/               # autosave, recovery snapshots, user settings
│   ├── templates/                 # 10 built-in professional document templates
│   ├── __tests__/                 # Automated test suites (DOCX, Exporters, Autosave, Templates, Mail Merge)
│   ├── App.tsx                    # Main coordinator component
│   ├── App.css                    # WordLite design system tokens, themes, and print styles
│   └── main.tsx
├── src-tauri/                     # Tauri 2 Rust desktop backend
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/              # Native filesystem and dialog permissions
│   └── src/
│       ├── lib.rs                 # Native atomic file operations and explorer reveal
│       └── main.rs
├── test_documents/                # Sample test documents & CSV data
├── DOCX_COMPATIBILITY_REPORT.md   # Detailed DOCX interoperability report
├── PERFORMANCE_REPORT.md          # 2 GB RAM performance benchmarks
└── USER_GUIDE.md                  # Comprehensive user guide and shortcut keys
```

---

## Setup & Development Commands

### Prerequisites
- Node.js &ge; 18 (Node 22 recommended)
- Rust toolchain &ge; 1.80 (`rustup update`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode (Vite Preview / Browser)
```bash
npm run dev
```

### 3. Run as Native Desktop Application (Tauri 2 Dev)
```bash
npm run tauri dev
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build Production Frontend Bundle
```bash
npm run build
```

---

## Packaging & Distribution

### Building for macOS (.app and .dmg)
To build a production macOS application bundle:
```bash
npm run tauri build
```
- Bundles are output in: `src-tauri/target/release/bundle/macos/WordLite.app`
- Disk image installer: `src-tauri/target/release/bundle/dmg/WordLite.dmg`
- Supports Apple Silicon (`aarch64-apple-darwin`) and Intel (`x86_64-apple-darwin`).

### Building for Windows (.msi and .exe)
To package for Windows:
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```
- Generates an MSI installer via WiX and lightweight standalone executable.
- Uses Microsoft WebView2 already built into Windows 10 and 11.

---

## Automated Test Results

All 13 automated tests across 5 test suites pass:
```
✓ src/__tests__/mailmerge.test.ts (2 tests)
✓ src/__tests__/templates.test.ts (2 tests)
✓ src/__tests__/exporters.test.ts (4 tests)
✓ src/__tests__/autosave.test.ts  (3 tests)
✓ src/__tests__/docx.test.ts       (2 tests)

Test Files  5 passed (5)
Tests       13 passed (13)
```

---

## Release Checklist

- [x] All visible ribbon controls and dialogs fully implemented (zero placeholder buttons).
- [x] Tested DOCX export and import roundtrip.
- [x] Tested PDF export and print stylesheet `@media print`.
- [x] Tested CSV Mail Merge interpolation.
- [x] Tested Autosave and crash recovery snapshot retrieval.
- [x] Light and Dark themes verified.
- [x] Keyboard shortcuts verified (`Ctrl/Cmd + S`, `O`, `N`, `P`, `Z`, `Y`, `B`, `I`, `U`, `F`, `H`, `Enter`).
- [x] Low memory usage (<150 MB idle target achieved for 2 GB RAM systems).
- [x] Atomic saving implemented in Rust backend.
