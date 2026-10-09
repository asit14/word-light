import React, { useState } from 'react';
import { ActiveRibbonTab, DocumentTab, PageSettings, ViewMode } from '../../types';
import { HomeTab } from './tabs/HomeTab';
import { InsertTab } from './tabs/InsertTab';
import { LayoutTab } from './tabs/LayoutTab';
import { ReferencesTab } from './tabs/ReferencesTab';
import { ReviewTab } from './tabs/ReviewTab';
import { MailingsTab } from './tabs/MailingsTab';
import { ViewTab } from './tabs/ViewTab';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RibbonProps {
  editor: any;
  activeTab: ActiveRibbonTab;
  onSelectTab: (tab: ActiveRibbonTab) => void;
  onOpenFileBackstage: () => void;
  currentDocument: DocumentTab;
  onUpdatePageSettings: (settings: Partial<PageSettings>) => void;
  // Modals & triggers
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenLinkDialog: () => void;
  onOpenHeaderFooter: () => void;
  onOpenSymbolPicker: () => void;
  onOpenPageSetup: () => void;
  onInsertTableOfContents: () => void;
  onInsertFootnote: () => void;
  onInsertCaption: () => void;
  onAddComment: () => void;
  onToggleCommentsSidebar: () => void;
  showCommentsSidebar: boolean;
  trackingChanges: boolean;
  onToggleTracking: () => void;
  onOpenRevisionsPanel: () => void;
  onOpenCompare: () => void;
  readOnly: boolean;
  onToggleReadOnly: () => void;
  onOpenWordCount: () => void;
  onOpenMailMergeDialog: () => void;
  recipientCount: number;
  currentRecordIndex: number;
  onPrevRecord: () => void;
  onNextRecord: () => void;
  onInsertMergeField: (field: string) => void;
  availableMergeFields: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showNavigationPane: boolean;
  onToggleNavigationPane: () => void;
  showFormattingMarks: boolean;
  onToggleFormattingMarks: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  editor,
  activeTab,
  onSelectTab,
  onOpenFileBackstage,
  currentDocument,
  onUpdatePageSettings,
  onOpenFind,
  onOpenReplace,
  onOpenLinkDialog,
  onOpenHeaderFooter,
  onOpenSymbolPicker,
  onOpenPageSetup,
  onInsertTableOfContents,
  onInsertFootnote,
  onInsertCaption,
  onAddComment,
  onToggleCommentsSidebar,
  showCommentsSidebar,
  trackingChanges,
  onToggleTracking,
  onOpenRevisionsPanel,
  onOpenCompare,
  readOnly,
  onToggleReadOnly,
  onOpenWordCount,
  onOpenMailMergeDialog,
  recipientCount,
  currentRecordIndex,
  onPrevRecord,
  onNextRecord,
  onInsertMergeField,
  availableMergeFields,
  viewMode,
  onViewModeChange,
  showRuler,
  onToggleRuler,
  showNavigationPane,
  onToggleNavigationPane,
  showFormattingMarks,
  onToggleFormattingMarks,
  zoom,
  onZoomChange,
  theme,
  onToggleTheme,
}) => {
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);

  return (
    <div className={`wordlite-ribbon-container ${isRibbonCollapsed ? 'collapsed' : ''}`}>
      {/* Ribbon Tab Bar */}
      <nav className="ribbon-tab-bar" role="tablist">
        {/* File Button opens Backstage */}
        <button
          className="ribbon-file-tab-btn"
          onClick={onOpenFileBackstage}
          role="tab"
          aria-selected={false}
        >
          File
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('home');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'home'}
        >
          Home
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'insert' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('insert');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'insert'}
        >
          Insert
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('layout');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'layout'}
        >
          Layout
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'references' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('references');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'references'}
        >
          References
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('review');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'review'}
        >
          Review
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'mailings' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('mailings');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'mailings'}
        >
          Mailings
        </button>

        <button
          className={`ribbon-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => {
            onSelectTab('view');
            setIsRibbonCollapsed(false);
          }}
          role="tab"
          aria-selected={activeTab === 'view'}
        >
          View
        </button>

        {/* Collapse Ribbon Toggle */}
        <div className="ribbon-tab-actions">
          <button
            className="ribbon-collapse-toggle"
            onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
            title={isRibbonCollapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
          >
            {isRibbonCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </nav>

      {/* Ribbon Tab Body Panels */}
      {!isRibbonCollapsed && (
        <div className="ribbon-body">
          {activeTab === 'home' && (
            <HomeTab
              editor={editor}
              onOpenFind={onOpenFind}
              onOpenReplace={onOpenReplace}
              showFormattingMarks={showFormattingMarks}
              onToggleFormattingMarks={onToggleFormattingMarks}
            />
          )}

          {activeTab === 'insert' && (
            <InsertTab
              editor={editor}
              onOpenLinkDialog={onOpenLinkDialog}
              onOpenHeaderFooter={onOpenHeaderFooter}
              onOpenSymbolPicker={onOpenSymbolPicker}
            />
          )}

          {activeTab === 'layout' && (
            <LayoutTab
              pageSettings={currentDocument.pageSettings}
              onUpdatePageSettings={onUpdatePageSettings}
              onOpenPageSetup={onOpenPageSetup}
            />
          )}

          {activeTab === 'references' && (
            <ReferencesTab
              editor={editor}
              onInsertTableOfContents={onInsertTableOfContents}
              onInsertFootnote={onInsertFootnote}
              onInsertCaption={onInsertCaption}
            />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              onAddComment={onAddComment}
              onToggleCommentsSidebar={onToggleCommentsSidebar}
              showCommentsSidebar={showCommentsSidebar}
              trackingChanges={trackingChanges}
              onToggleTracking={onToggleTracking}
              onOpenRevisionsPanel={onOpenRevisionsPanel}
              onOpenCompare={onOpenCompare}
              readOnly={readOnly}
              onToggleReadOnly={onToggleReadOnly}
              onOpenWordCount={onOpenWordCount}
            />
          )}

          {activeTab === 'mailings' && (
            <MailingsTab
              onOpenMailMergeDialog={onOpenMailMergeDialog}
              recipientCount={recipientCount}
              currentRecordIndex={currentRecordIndex}
              onPrevRecord={onPrevRecord}
              onNextRecord={onNextRecord}
              onInsertField={onInsertMergeField}
              availableFields={availableMergeFields}
            />
          )}

          {activeTab === 'view' && (
            <ViewTab
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              showRuler={showRuler}
              onToggleRuler={onToggleRuler}
              showNavigationPane={showNavigationPane}
              onToggleNavigationPane={onToggleNavigationPane}
              showFormattingMarks={showFormattingMarks}
              onToggleFormattingMarks={onToggleFormattingMarks}
              zoom={zoom}
              onZoomChange={onZoomChange}
              theme={theme}
              onToggleTheme={onToggleTheme}
            />
          )}
        </div>
      )}
    </div>
  );
};
