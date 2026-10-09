import React, { useState, useEffect, useCallback } from 'react';
import {
  DocumentTab,
  ActiveRibbonTab,
  ViewMode,
  MailMergeRecord,
  PageSettings,
} from './types';
import { DEFAULT_PAGE_SETTINGS } from './types/defaults';
import { QuickAccessToolbar } from './components/ribbon/QuickAccessToolbar';
import { Ribbon } from './components/ribbon/Ribbon';
import { DocumentTabs } from './components/tabs/DocumentTabs';
import { Ruler } from './layout/Ruler';
import { PageCanvas } from './layout/PageCanvas';
import { StatusBar } from './layout/StatusBar';
import { NavigationPane } from './components/navigation/NavigationPane';
import { CommentsSidebar } from './components/comments/CommentsSidebar';
import { RevisionsPanel } from './components/revisions/RevisionsPanel';
import { FileTab } from './components/ribbon/tabs/FileTab';
import { FindReplaceDialog } from './components/dialogs/FindReplaceDialog';
import { PageSetupDialog } from './components/dialogs/PageSetupDialog';
import { HeaderFooterDialog } from './components/dialogs/HeaderFooterDialog';
import { SymbolPickerModal } from './components/dialogs/SymbolPickerModal';
import { WordCountDialog } from './components/dialogs/WordCountDialog';
import { HyperlinkDialog } from './components/dialogs/HyperlinkDialog';
import { TemplatesModal } from './components/templates/TemplatesModal';
import { MailMergeDialog } from './components/mailmerge/MailMergeDialog';
import { CompareDialog } from './components/compare/CompareDialog';
import { RecoveryPrompt } from './components/dialogs/RecoveryPrompt';

import {
  openDocumentDialog,
  saveDocumentFile,
  exportDocumentAs,
} from './services/file/fileManager';
import {
  saveRecoverySnapshot,
  getRecoverySnapshots,
  clearRecoverySnapshot,
  clearAllRecoverySnapshots,
  RecoverySnapshot,
} from './services/storage/autosave';
import {
  loadUserSettings,
  saveUserSettings,
} from './services/storage/settings';
import { DocumentTemplate } from './templates/sampleDocuments';

import './App.css';

export function App() {
  const [userSettings] = useState(loadUserSettings());
  const [theme, setTheme] = useState<'light' | 'dark'>(userSettings.theme);

  // Tabs state
  const [tabs, setTabs] = useState<DocumentTab[]>([
    {
      id: 'doc_initial',
      fileName: 'Document 1.docx',
      isModified: false,
      contentJson: null,
      contentHtml: `
        <h1 style="color: #1b365d;">Welcome to WordLite</h1>
        <p><strong>WordLite</strong> is a fast, lightweight, and offline desktop word processor designed to run smoothly on low-memory hardware (tested for 2 GB RAM).</p>
        <hr />
        <h2>Key Features</h2>
        <ul>
          <li><strong>DOCX Interoperability:</strong> Import and export Microsoft Word documents with full formatting fidelity.</li>
          <li><strong>Paginated Page Layout:</strong> True A4 and US Letter page canvas with margins, headers, and footers.</li>
          <li><strong>Rich Ribbon Toolbar:</strong> Home, Insert, Layout, References, Review, Mailings, and View tabs.</li>
          <li><strong>Review Tools:</strong> Comments, Track Changes with revision history, and side-by-side Document Compare.</li>
          <li><strong>Offline Data Merge:</strong> Local CSV Mail Merge without cloud dependencies.</li>
          <li><strong>Autosave & Crash Recovery:</strong> Local snapshots to ensure your work is never lost.</li>
        </ul>
        <p>Start typing here or choose a template from <em>File &rarr; New</em> to get started!</p>
      `,
      pageSettings: { ...DEFAULT_PAGE_SETTINGS },
      comments: [],
      revisions: [],
      trackingChanges: false,
      readOnly: false,
      createdAt: Date.now(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('doc_initial');

  // Active editor instance
  const [editor, setEditor] = useState<any>(null);

  // Navigation & UI state
  const [activeRibbonTab, setActiveRibbonTab] = useState<ActiveRibbonTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [zoom, setZoom] = useState<number>(1.0);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle panels
  const [showNavigationPane, setShowNavigationPane] = useState(false);
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false);
  const [showRevisionsPanel, setShowRevisionsPanel] = useState(false);

  // Dialogs
  const [isFileBackstageOpen, setIsFileBackstageOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [findMode, setFindMode] = useState<'find' | 'replace'>('find');
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isHeaderFooterOpen, setIsHeaderFooterOpen] = useState(false);
  const [isSymbolPickerOpen, setIsSymbolPickerOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isHyperlinkOpen, setIsHyperlinkOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isMailMergeOpen, setIsMailMergeOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Recovery snapshots
  const [recoverySnapshots, setRecoverySnapshots] = useState<RecoverySnapshot[]>([]);

  // Mail merge records
  const [mailMergeRecords, setMailMergeRecords] = useState<MailMergeRecord[]>([]);
  const [mailMergeFields, setMailMergeFields] = useState<string[]>([]);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

  // Dynamic automatic page pagination state
  const [measuredTotalPages, setMeasuredTotalPages] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(1);

  // Active tab reference
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Theme application
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveUserSettings({ ...userSettings, theme });
  }, [theme]);

  // Check for recovery snapshots on startup
  useEffect(() => {
    const list = getRecoverySnapshots();
    if (list.length > 0) {
      setRecoverySnapshots(list);
    }
  }, []);

  // Autosave interval
  useEffect(() => {
    const interval = setInterval(() => {
      tabs.forEach((tab) => {
        if (tab.isModified) {
          saveRecoverySnapshot(tab);
        }
      });
    }, (userSettings.autosaveIntervalSec || 30) * 1000);

    return () => clearInterval(interval);
  }, [tabs, userSettings.autosaveIntervalSec]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if (mod && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFile();
      } else if (mod && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewBlank();
      } else if (mod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeTab, tabs]);

  // Document statistics
  const docText = editor?.state?.doc?.textContent || '';
  const wordCount = docText.trim() ? docText.trim().split(/\s+/).length : 0;
  const charCount = docText.length;
  const charCountNoSpaces = docText.replace(/\s/g, '').length;
  const paragraphCount = docText ? docText.split(/\n+/).filter(Boolean).length : 0;
  const lineCount = Math.max(1, Math.ceil(charCount / 80));
  // Approximate page count based on character volume & paper height
  const pageCount = Math.max(1, Math.ceil(charCount / 2400));

  // Tab updates from editor
  const handleEditorUpdate = useCallback(
    (contentJson: any, contentHtml: string) => {
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            // Track changes if tracking is active
            let updatedRevisions = t.revisions;
            if (t.trackingChanges && !t.isModified) {
              const newRev = {
                id: `rev_${Date.now()}`,
                type: 'format' as const,
                author: 'Author',
                timestamp: new Date().toLocaleTimeString(),
                description: 'Content revision made',
                content: contentHtml.slice(0, 100),
              };
              updatedRevisions = [newRev, ...t.revisions];
            }

            return {
              ...t,
              contentJson,
              contentHtml,
              isModified: true,
              revisions: updatedRevisions,
            };
          }
          return t;
        })
      );
    },
    [activeTabId]
  );

  // New Blank Document
  const handleNewBlank = () => {
    const newId = `doc_${Date.now()}`;
    const newDocNum = tabs.length + 1;
    const newTab: DocumentTab = {
      id: newId,
      fileName: `Document ${newDocNum}.docx`,
      isModified: false,
      contentJson: null,
      contentHtml: '<p></p>',
      pageSettings: { ...DEFAULT_PAGE_SETTINGS },
      comments: [],
      revisions: [],
      trackingChanges: false,
      readOnly: false,
      createdAt: Date.now(),
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  // Open Template
  const handleSelectTemplate = (template: DocumentTemplate) => {
    const newId = `doc_${Date.now()}`;
    const newTab: DocumentTab = {
      id: newId,
      fileName: `${template.name}.docx`,
      isModified: true,
      contentJson: null,
      contentHtml: template.htmlContent,
      pageSettings: { ...DEFAULT_PAGE_SETTINGS },
      comments: [],
      revisions: [],
      trackingChanges: false,
      readOnly: false,
      createdAt: Date.now(),
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  // Open Document File
  const handleOpenFile = async () => {
    try {
      const opened = await openDocumentDialog();
      if (!opened) return;

      const newId = `doc_${Date.now()}`;
      const newTab: DocumentTab = {
        id: newId,
        filePath: opened.path,
        fileName: opened.name,
        isModified: false,
        contentJson: null,
        contentHtml: opened.contentHtml,
        pageSettings: { ...DEFAULT_PAGE_SETTINGS },
        comments: [],
        revisions: [],
        trackingChanges: false,
        readOnly: false,
        createdAt: Date.now(),
      };

      setTabs([...tabs, newTab]);
      setActiveTabId(newId);

      if (opened.warnings && opened.warnings.length > 0) {
        console.info('DOCX Import notices:', opened.warnings);
      }
    } catch (err) {
      console.error('Failed to open document:', err);
    }
  };

  // Save Document
  const handleSave = async () => {
    if (!activeTab) return;
    setIsSaving(true);
    try {
      const result = await saveDocumentFile(
        activeTab.contentJson,
        activeTab.contentHtml,
        activeTab.pageSettings,
        activeTab.filePath,
        activeTab.fileName
      );

      if (result.saved) {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTab.id
              ? {
                  ...t,
                  filePath: result.path || t.filePath,
                  isModified: false,
                  lastSavedAt: Date.now(),
                }
              : t
          )
        );
        clearRecoverySnapshot(activeTab.id);
      }
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Save As
  const handleSaveAs = async () => {
    if (!activeTab) return;
    setIsSaving(true);
    try {
      const result = await saveDocumentFile(
        activeTab.contentJson,
        activeTab.contentHtml,
        activeTab.pageSettings,
        undefined, // Force dialog prompt
        activeTab.fileName
      );

      if (result.saved && result.path) {
        const newName = result.path.split(/[/\\]/).pop() || activeTab.fileName;
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTab.id
              ? {
                  ...t,
                  filePath: result.path,
                  fileName: newName,
                  isModified: false,
                  lastSavedAt: Date.now(),
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Error in Save As:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Export Document
  const handleExport = async (format: 'docx' | 'txt' | 'md' | 'rtf' | 'html') => {
    if (!activeTab) return;
    await exportDocumentAs(
      format,
      activeTab.contentJson,
      activeTab.contentHtml,
      activeTab.pageSettings,
      activeTab.fileName
    );
  };

  // Close Tab
  const handleCloseTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      // Create fresh blank if closing last remaining tab
      handleNewBlank();
    }
    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id && filtered.length > 0) {
      setActiveTabId(filtered[0].id);
    }
  };

  // Update Page Settings for Active Tab
  const handleUpdatePageSettings = (newSettings: Partial<PageSettings>) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              isModified: true,
              pageSettings: { ...t.pageSettings, ...newSettings },
            }
          : t
      )
    );
  };

  // Insert Table of Contents
  const handleInsertTOC = () => {
    if (!editor) return;
    const headings: string[] = [];
    editor.state.doc.descendants((node: any) => {
      if (node.type.name === 'heading') {
        const level = node.attrs.level || 1;
        const indent = '&nbsp;'.repeat((level - 1) * 4);
        headings.push(`<p>${indent}<strong>${node.textContent}</strong>............................................ Page 1</p>`);
      }
    });

    const tocHtml = `
      <div style="border: 1px solid #c8c8c8; background: #fafafa; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #1b365d;">Table of Contents</h3>
        ${headings.length > 0 ? headings.join('') : '<p><em>No headings found. Format headings with Heading 1-3 to appear in Table of Contents.</em></p>'}
      </div>
    `;
    editor.chain().focus().insertContent(tocHtml).run();
  };

  // Insert Footnote
  const handleInsertFootnote = () => {
    if (!editor) return;
    const noteNum = (activeTab.contentHtml.match(/\[\d+\]/g) || []).length + 1;
    editor.chain().focus().insertContent(`<sup>[${noteNum}]</sup>`).run();
  };

  // Insert Caption
  const handleInsertCaption = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<p style="font-size: 9.5pt; color: #555; text-align: center;"><em>Figure 1: Illustration caption</em></p>').run();
  };

  // Comments handlers
  const handleAddComment = (text?: string) => {
    if (!editor) return;
    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to) || '';

    const newComment = {
      id: `comment_${Date.now()}`,
      author: 'User',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text || 'Document note',
      selectedText: selectedText || undefined,
      fromPos: selection.from,
      toPos: selection.to,
      resolved: false,
      replies: [],
    };

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, comments: [newComment, ...t.comments] }
          : t
      )
    );
    setShowCommentsSidebar(true);
  };

  const handleReplyComment = (commentId: string, replyText: string) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const updated = t.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  replies: [
                    ...c.replies,
                    {
                      id: `reply_${Date.now()}`,
                      author: 'User',
                      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      text: replyText,
                    },
                  ],
                }
              : c
          );
          return { ...t, comments: updated };
        }
        return t;
      })
    );
  };

  const handleToggleResolveComment = (commentId: string) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const updated = t.comments.map((c) =>
            c.id === commentId ? { ...c, resolved: !c.resolved } : c
          );
          return { ...t, comments: updated };
        }
        return t;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, comments: t.comments.filter((c) => c.id !== commentId) }
          : t
      )
    );
  };

  // Revisions handlers
  const handleAcceptRevision = (id: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, revisions: t.revisions.filter((r) => r.id !== id) }
          : t
      )
    );
  };

  const handleRejectRevision = (id: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, revisions: t.revisions.filter((r) => r.id !== id) }
          : t
      )
    );
  };

  // Restore snapshot
  const handleRestoreSnapshot = (snapshot: RecoverySnapshot) => {
    const restoredTab: DocumentTab = {
      id: `restored_${Date.now()}`,
      fileName: `Restored - ${snapshot.fileName}`,
      isModified: true,
      contentJson: snapshot.contentJson,
      contentHtml: snapshot.contentHtml,
      pageSettings: snapshot.pageSettings || { ...DEFAULT_PAGE_SETTINGS },
      comments: [],
      revisions: [],
      trackingChanges: false,
      readOnly: false,
      createdAt: Date.now(),
    };
    setTabs([...tabs, restoredTab]);
    setActiveTabId(restoredTab.id);
    clearRecoverySnapshot(snapshot.tabId);
    setRecoverySnapshots((prev) => prev.filter((s) => s.id !== snapshot.id));
  };

  return (
    <div className="wordlite-app-shell">
      {/* Recovery Banner if unsaved crashes exist */}
      <RecoveryPrompt
        snapshots={recoverySnapshots}
        onRestore={handleRestoreSnapshot}
        onDismiss={() => {
          setRecoverySnapshots([]);
          clearAllRecoverySnapshots();
        }}
      />

      {/* Top Window Bar & Quick Access Toolbar */}
      <QuickAccessToolbar
        onSave={handleSave}
        onUndo={() => editor?.commands.undo()}
        onRedo={() => editor?.commands.redo()}
        canUndo={editor?.can().undo() || false}
        canRedo={editor?.can().redo() || false}
        onNew={handleNewBlank}
        onOpen={handleOpenFile}
        onPrint={() => window.print()}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        docTitle={activeTab.fileName}
        isModified={activeTab.isModified}
      />

      {/* Ribbon Toolbar */}
      <Ribbon
        editor={editor}
        activeTab={activeRibbonTab}
        onSelectTab={setActiveRibbonTab}
        onOpenFileBackstage={() => setIsFileBackstageOpen(true)}
        currentDocument={activeTab}
        onUpdatePageSettings={handleUpdatePageSettings}
        onOpenFind={() => {
          setFindMode('find');
          setIsFindReplaceOpen(true);
        }}
        onOpenReplace={() => {
          setFindMode('replace');
          setIsFindReplaceOpen(true);
        }}
        onOpenLinkDialog={() => setIsHyperlinkOpen(true)}
        onOpenHeaderFooter={() => setIsHeaderFooterOpen(true)}
        onOpenSymbolPicker={() => setIsSymbolPickerOpen(true)}
        onOpenPageSetup={() => setIsPageSetupOpen(true)}
        onInsertTableOfContents={handleInsertTOC}
        onInsertFootnote={handleInsertFootnote}
        onInsertCaption={handleInsertCaption}
        onAddComment={() => handleAddComment()}
        onToggleCommentsSidebar={() => setShowCommentsSidebar(!showCommentsSidebar)}
        showCommentsSidebar={showCommentsSidebar}
        trackingChanges={activeTab.trackingChanges}
        onToggleTracking={() =>
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId
                ? { ...t, trackingChanges: !t.trackingChanges }
                : t
            )
          )
        }
        onOpenRevisionsPanel={() => setShowRevisionsPanel(!showRevisionsPanel)}
        onOpenCompare={() => setIsCompareOpen(true)}
        readOnly={activeTab.readOnly}
        onToggleReadOnly={() =>
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId ? { ...t, readOnly: !t.readOnly } : t
            )
          )
        }
        onOpenWordCount={() => setIsWordCountOpen(true)}
        onOpenMailMergeDialog={() => setIsMailMergeOpen(true)}
        recipientCount={mailMergeRecords.length}
        currentRecordIndex={currentRecordIndex}
        onPrevRecord={() => setCurrentRecordIndex(Math.max(0, currentRecordIndex - 1))}
        onNextRecord={() =>
          setCurrentRecordIndex(
            Math.min(mailMergeRecords.length - 1, currentRecordIndex + 1)
          )
        }
        onInsertMergeField={(field) =>
          editor?.chain().focus().insertContent(`«${field}»`).run()
        }
        availableMergeFields={mailMergeFields}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showRuler={activeTab.pageSettings.showRuler}
        onToggleRuler={() =>
          handleUpdatePageSettings({
            showRuler: !activeTab.pageSettings.showRuler,
          })
        }
        showNavigationPane={showNavigationPane}
        onToggleNavigationPane={() => setShowNavigationPane(!showNavigationPane)}
        showFormattingMarks={activeTab.pageSettings.showFormattingMarks}
        onToggleFormattingMarks={() =>
          handleUpdatePageSettings({
            showFormattingMarks: !activeTab.pageSettings.showFormattingMarks,
          })
        }
        zoom={zoom}
        onZoomChange={setZoom}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />

      {/* Document Tabs Strip */}
      <DocumentTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewBlank}
      />

      {/* Horizontal Ruler */}
      {activeTab.pageSettings.showRuler && viewMode === 'print' && (
        <Ruler pageSettings={activeTab.pageSettings} zoom={zoom} />
      )}

      {/* Main Workspace */}
      <main className="wordlite-workspace">
        {/* Navigation Pane */}
        <NavigationPane
          isOpen={showNavigationPane}
          onClose={() => setShowNavigationPane(false)}
          editor={editor}
        />

        {/* Page Canvas (TipTap Editor) */}
        <PageCanvas
          tab={activeTab}
          zoom={zoom}
          viewMode={viewMode}
          onUpdate={handleEditorUpdate}
          onEditorReady={setEditor}
          onSaveShortcut={handleSave}
          onFindShortcut={() => {
            setFindMode('find');
            setIsFindReplaceOpen(true);
          }}
          pageCount={measuredTotalPages}
          onPageCountChange={(total, current) => {
            setMeasuredTotalPages(total);
            setActivePageIndex(current);
          }}
        />

        {/* Comments Sidebar */}
        <CommentsSidebar
          isOpen={showCommentsSidebar}
          onClose={() => setShowCommentsSidebar(false)}
          comments={activeTab.comments}
          onAddComment={handleAddComment}
          onReplyComment={handleReplyComment}
          onToggleResolve={handleToggleResolveComment}
          onDeleteComment={handleDeleteComment}
        />

        {/* Revisions Panel */}
        <RevisionsPanel
          isOpen={showRevisionsPanel}
          onClose={() => setShowRevisionsPanel(false)}
          revisions={activeTab.revisions}
          onAcceptRevision={handleAcceptRevision}
          onRejectRevision={handleRejectRevision}
          onAcceptAll={() =>
            setTabs((prev) =>
              prev.map((t) => (t.id === activeTabId ? { ...t, revisions: [] } : t))
            )
          }
          onRejectAll={() =>
            setTabs((prev) =>
              prev.map((t) => (t.id === activeTabId ? { ...t, revisions: [] } : t))
            )
          }
        />
      </main>

      {/* Status Bar */}
      <StatusBar
        pageCount={measuredTotalPages}
        currentPage={activePageIndex}
        wordCount={wordCount}
        charCount={charCount}
        isModified={activeTab.isModified}
        isSaving={isSaving}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoom={zoom}
        onZoomChange={setZoom}
        onWordCountClick={() => setIsWordCountOpen(true)}
      />

      {/* Backstage File View */}
      <FileTab
        isOpen={isFileBackstageOpen}
        onClose={() => setIsFileBackstageOpen(false)}
        activeTab={activeTab}
        onNewBlank={handleNewBlank}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenFile={handleOpenFile}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onExport={handleExport}
        onPrint={() => window.print()}
        onCloseDocument={() => handleCloseTab(activeTab.id)}
        wordCount={wordCount}
        charCount={charCount}
      />

      {/* Dialogs and Modals */}
      <FindReplaceDialog
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        editor={editor}
        initialMode={findMode}
      />

      <PageSetupDialog
        isOpen={isPageSetupOpen}
        onClose={() => setIsPageSetupOpen(false)}
        pageSettings={activeTab.pageSettings}
        onSave={handleUpdatePageSettings}
      />

      <HeaderFooterDialog
        isOpen={isHeaderFooterOpen}
        onClose={() => setIsHeaderFooterOpen(false)}
        pageSettings={activeTab.pageSettings}
        onSave={handleUpdatePageSettings}
      />

      <SymbolPickerModal
        isOpen={isSymbolPickerOpen}
        onClose={() => setIsSymbolPickerOpen(false)}
        onInsertSymbol={(symbol) =>
          editor?.chain().focus().insertContent(symbol).run()
        }
      />

      <WordCountDialog
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        pageCount={pageCount}
        wordCount={wordCount}
        charCount={charCount}
        charCountNoSpaces={charCountNoSpaces}
        paragraphCount={paragraphCount}
        lineCount={lineCount}
      />

      <HyperlinkDialog
        isOpen={isHyperlinkOpen}
        onClose={() => setIsHyperlinkOpen(false)}
        editor={editor}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <MailMergeDialog
        isOpen={isMailMergeOpen}
        onClose={() => setIsMailMergeOpen(false)}
        onDataLoaded={(records, fields) => {
          setMailMergeRecords(records);
          setMailMergeFields(fields);
        }}
        records={mailMergeRecords}
        fields={mailMergeFields}
        currentDocumentHtml={activeTab.contentHtml}
      />

      <CompareDialog
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentDocumentHtml={activeTab.contentHtml}
      />
    </div>
  );
}

export default App;
