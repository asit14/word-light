import React, { useMemo, useState, useEffect, useRef } from 'react';
import { DocumentTab, ViewMode } from '../types';
import { PAPER_DIMENSIONS } from '../types/defaults';
import { TipTapEditor } from '../editor/TipTapEditor';
import { PlusCircle } from 'lucide-react';

interface PageCanvasProps {
  tab: DocumentTab;
  zoom: number; // e.g. 1.0 = 100%
  viewMode: ViewMode;
  onUpdate: (contentJson: any, contentHtml: string) => void;
  onEditorReady: (editor: any) => void;
  onSaveShortcut?: () => void;
  onFindShortcut?: () => void;
  pageCount: number;
  onPageCountChange?: (totalPages: number, currentPage: number) => void;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  tab,
  zoom,
  viewMode,
  onUpdate,
  onEditorReady,
  onSaveShortcut,
  onFindShortcut,
  onPageCountChange,
}) => {
  const { pageSettings } = tab;
  const paper = PAPER_DIMENSIONS[pageSettings.size as import('../types').PaperSize] || PAPER_DIMENSIONS.A4;
  const isLandscape = pageSettings.orientation === 'landscape';

  // Calculate dimensions in millimeters
  const widthMm = isLandscape ? paper.height : paper.width;
  const heightMm = isLandscape ? paper.width : paper.height;

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // Dynamic automatic page calculation
  const [autoPageCount, setAutoPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Usable content height per page in pixels (96 DPI conversion: 1mm = 3.7795px)
  const usableHeightMm = Math.max(100, heightMm - pageSettings.margins.top - pageSettings.margins.bottom);
  const usableHeightPx = usableHeightMm * 3.7795;
  const pageHeightPx = heightMm * 3.7795;

  // Margin styles in millimeters
  const marginStyles = useMemo(() => {
    return {
      paddingTop: `${pageSettings.margins.top}mm`,
      paddingBottom: `${pageSettings.margins.bottom}mm`,
      paddingLeft: `${pageSettings.margins.left}mm`,
      paddingRight: `${pageSettings.margins.right}mm`,
    };
  }, [pageSettings.margins]);

  const columnStyle = useMemo(() => {
    if (pageSettings.columns > 1) {
      return {
        columnCount: pageSettings.columns,
        columnGap: '12mm',
        columnRule: '1px solid #e0e0e0',
      };
    }
    return {};
  }, [pageSettings.columns]);

  // Measure content scroll height & manual page breaks to auto-paginate
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measurePages = () => {
      const scrollH = el.scrollHeight || 0;
      // Count manual page breaks in document HTML
      const manualBreaks = (tab.contentHtml ? (tab.contentHtml.match(/data-page-break="true"/g) || []).length : 0);

      // Automatic overflow page calculation
      const overflowPages = Math.max(1, Math.ceil(scrollH / usableHeightPx));
      const totalPages = Math.max(overflowPages, manualBreaks + 1);

      setAutoPageCount(totalPages);
      if (onPageCountChange) {
        onPageCountChange(totalPages, currentPage);
      }
    };

    measurePages();

    // ResizeObserver watches for text typing, pasting, or image insertions
    const observer = new ResizeObserver(() => {
      measurePages();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [tab.contentHtml, usableHeightPx, currentPage, onPageCountChange]);

  // Track active page based on scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const activePage = Math.min(autoPageCount, Math.max(1, Math.floor(scrollTop / (pageHeightPx * zoom * 0.9)) + 1));
    if (activePage !== currentPage) {
      setCurrentPage(activePage);
      if (onPageCountChange) {
        onPageCountChange(autoPageCount, activePage);
      }
    }
  };

  const handleAddPageManually = () => {
    if (editorInstance) {
      editorInstance.chain().focus().insertBlankPage().run();
    }
  };

  const handleEditorReadyInternal = (ed: any) => {
    setEditorInstance(ed);
    onEditorReady(ed);
  };

  if (viewMode === 'focus') {
    return (
      <div className="wordlite-focus-canvas">
        <div className="wordlite-focus-sheet">
          <TipTapEditor
            tab={tab}
            onUpdate={onUpdate}
            onEditorReady={handleEditorReadyInternal}
            onSaveShortcut={onSaveShortcut}
            onFindShortcut={onFindShortcut}
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'draft') {
    return (
      <div className="wordlite-draft-canvas">
        <div className="wordlite-draft-container" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          <TipTapEditor
            tab={tab}
            onUpdate={onUpdate}
            onEditorReady={handleEditorReadyInternal}
            onSaveShortcut={onSaveShortcut}
            onFindShortcut={onFindShortcut}
          />
        </div>
      </div>
    );
  }

  // Standard Print Layout View with realistic paginated sheets & automatic page boundaries
  return (
    <div
      ref={scrollContainerRef}
      className="wordlite-canvas-scroll-container"
      onScroll={handleScroll}
    >
      <div
        className="wordlite-zoom-wrapper"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div
          className={`wordlite-page-sheet ${pageSettings.showFormattingMarks ? 'show-formatting-marks' : ''}`}
          style={{
            width: `${widthMm}mm`,
            minHeight: `${heightMm * autoPageCount}mm`,
            ...marginStyles,
          }}
        >
          {/* Header Zone for Page 1 */}
          <div
            className="wordlite-page-header"
            style={{
              top: `${pageSettings.headerDistance}mm`,
              left: `${pageSettings.margins.left}mm`,
              right: `${pageSettings.margins.right}mm`,
            }}
          >
            <span className="header-text">{pageSettings.headerText || ''}</span>
            <span className="header-date">
              {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Document Content Canvas */}
          <div ref={contentRef} className="wordlite-document-content" style={columnStyle}>
            <TipTapEditor
              tab={tab}
              onUpdate={onUpdate}
              onEditorReady={handleEditorReadyInternal}
              onSaveShortcut={onSaveShortcut}
              onFindShortcut={onFindShortcut}
            />
          </div>

          {/* Footer Zone for Bottom of Document */}
          <div
            className="wordlite-page-footer"
            style={{
              bottom: `${pageSettings.footerDistance}mm`,
              left: `${pageSettings.margins.left}mm`,
              right: `${pageSettings.margins.right}mm`,
            }}
          >
            <span className="footer-text">{pageSettings.footerText || ''}</span>
            {pageSettings.showPageNumbers && (
              <span className="footer-page-num">
                Page {currentPage} of {autoPageCount}
              </span>
            )}
          </div>
        </div>

        {/* Manual Add Page Action Bar at Bottom of Canvas */}
        <div className="wordlite-canvas-page-actions">
          <button
            className="canvas-add-page-btn"
            onClick={handleAddPageManually}
            title="Add a new blank page to the document (Ctrl/Cmd + Enter)"
          >
            <PlusCircle size={15} />
            <span>Add Blank Page</span>
          </button>
          <span className="canvas-page-info">
            Total {autoPageCount} {autoPageCount === 1 ? 'Page' : 'Pages'} ({paper.name})
          </span>
        </div>
      </div>
    </div>
  );
};
