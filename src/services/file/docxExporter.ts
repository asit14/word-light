import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  convertMillimetersToTwip,
  PageOrientation as DocxPageOrientation,
} from 'docx';
import { PageSettings, PAPER_DIMENSIONS } from '../../types';

export async function exportToDocxBlob(
  editorContent: any, // TipTap JSON or HTML
  pageSettings: PageSettings,
  documentTitle = 'WordLite Document'
): Promise<Blob> {
  const paper = PAPER_DIMENSIONS[pageSettings.size] || PAPER_DIMENSIONS.A4;
  const isLandscape = pageSettings.orientation === 'landscape';
  const widthMm = isLandscape ? paper.height : paper.width;
  const heightMm = isLandscape ? paper.width : paper.height;

  const children: (Paragraph | Table)[] = [];

  // Parse TipTap JSON content if available
  if (editorContent && editorContent.type === 'doc' && Array.isArray(editorContent.content)) {
    for (const node of editorContent.content) {
      const docxItem = convertTipTapNodeToDocx(node);
      if (docxItem) {
        if (Array.isArray(docxItem)) {
          children.push(...docxItem);
        } else {
          children.push(docxItem);
        }
      }
    }
  } else {
    // Fallback: parse basic text or HTML
    children.push(
      new Paragraph({
        children: [new TextRun(typeof editorContent === 'string' ? editorContent : 'Document content')],
      })
    );
  }

  // If no children, add empty paragraph
  if (children.length === 0) {
    children.push(new Paragraph({ children: [new TextRun('')] }));
  }

  // Create standard DOCX Document with page layout and headers/footers
  const doc = new Document({
    title: documentTitle,
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(widthMm),
              height: convertMillimetersToTwip(heightMm),
              orientation: isLandscape ? DocxPageOrientation.LANDSCAPE : DocxPageOrientation.PORTRAIT,
            },
            margin: {
              top: convertMillimetersToTwip(pageSettings.margins.top),
              bottom: convertMillimetersToTwip(pageSettings.margins.bottom),
              left: convertMillimetersToTwip(pageSettings.margins.left),
              right: convertMillimetersToTwip(pageSettings.margins.right),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: pageSettings.headerText || '',
                    font: 'Calibri',
                    size: 18, // 9pt
                    color: '777777',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  ...(pageSettings.footerText
                    ? [
                        new TextRun({
                          text: `${pageSettings.footerText}  |  `,
                          font: 'Calibri',
                          size: 18,
                          color: '777777',
                        }),
                      ]
                    : []),
                  ...(pageSettings.showPageNumbers
                    ? [
                        new TextRun({
                          text: 'Page ',
                          font: 'Calibri',
                          size: 18,
                          color: '777777',
                        }),
                        new TextRun({
                          children: [PageNumber.CURRENT],
                          font: 'Calibri',
                          size: 18,
                          color: '777777',
                        }),
                        new TextRun({
                          text: ' of ',
                          font: 'Calibri',
                          size: 18,
                          color: '777777',
                        }),
                        new TextRun({
                          children: [PageNumber.TOTAL_PAGES],
                          font: 'Calibri',
                          size: 18,
                          color: '777777',
                        }),
                      ]
                    : []),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function convertTipTapNodeToDocx(node: any): Paragraph | Table | (Paragraph | Table)[] | null {
  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level || 1;
      const headingLevels: Record<number, any> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };
      return new Paragraph({
        heading: headingLevels[level] || HeadingLevel.HEADING_1,
        alignment: getAlignment(node.attrs?.textAlign),
        children: parseTextRuns(node.content),
        spacing: { before: 200, after: 100 },
      });
    }

    case 'paragraph': {
      return new Paragraph({
        alignment: getAlignment(node.attrs?.textAlign),
        children: parseTextRuns(node.content),
        spacing: { before: 60, after: 60 },
      });
    }

    case 'bulletList':
    case 'orderedList': {
      const items: Paragraph[] = [];
      if (Array.isArray(node.content)) {
        for (const item of node.content) {
          if (item.type === 'listItem' && Array.isArray(item.content)) {
            for (const subNode of item.content) {
              items.push(
                new Paragraph({
                  bullet: node.type === 'bulletList' ? { level: 0 } : undefined,
                  numbering: node.type === 'orderedList' ? { reference: 'default-numbering', level: 0 } : undefined,
                  children: parseTextRuns(subNode.content),
                })
              );
            }
          }
        }
      }
      return items;
    }

    case 'table': {
      return convertTableNode(node);
    }

    case 'pageBreak': {
      return new Paragraph({
        pageBreakBefore: true,
        children: [new TextRun('')],
      });
    }

    case 'horizontalRule': {
      return new Paragraph({
        border: {
          bottom: {
            color: 'CCCCCC',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [new TextRun('')],
      });
    }

    default:
      if (node.content) {
        return new Paragraph({
          children: parseTextRuns(node.content),
        });
      }
      return null;
  }
}

function parseTextRuns(content: any[]): TextRun[] {
  if (!Array.isArray(content)) return [new TextRun('')];

  return content.map((item) => {
    if (item.type === 'text') {
      let isBold = false;
      let isItalic = false;
      let isUnderline = false;
      let isStrike = false;
      let isSubscript = false;
      let isSuperscript = false;
      let color: string | undefined;

      if (Array.isArray(item.marks)) {
        for (const mark of item.marks) {
          if (mark.type === 'bold') isBold = true;
          if (mark.type === 'italic') isItalic = true;
          if (mark.type === 'underline') isUnderline = true;
          if (mark.type === 'strike') isStrike = true;
          if (mark.type === 'subscript') isSubscript = true;
          if (mark.type === 'superscript') isSuperscript = true;
          if (mark.type === 'textStyle' && mark.attrs?.color) {
            color = mark.attrs.color.replace('#', '');
          }
        }
      }

      return new TextRun({
        text: item.text || '',
        bold: isBold,
        italics: isItalic,
        underline: isUnderline ? {} : undefined,
        strike: isStrike,
        subScript: isSubscript,
        superScript: isSuperscript,
        color,
        font: 'Calibri',
      });
    }
    return new TextRun('');
  });
}

function getAlignment(align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
  switch (align) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}

function convertTableNode(node: any): Table {
  const rows: TableRow[] = [];

  if (Array.isArray(node.content)) {
    for (const rowNode of node.content) {
      if (rowNode.type === 'tableRow' && Array.isArray(rowNode.content)) {
        const cells: TableCell[] = [];

        for (const cellNode of rowNode.content) {
          const cellParagraphs: Paragraph[] = [];
          if (Array.isArray(cellNode.content)) {
            for (const child of cellNode.content) {
              cellParagraphs.push(
                new Paragraph({
                  children: parseTextRuns(child.content),
                })
              );
            }
          }
          if (cellParagraphs.length === 0) {
            cellParagraphs.push(new Paragraph({ children: [new TextRun('')] }));
          }

          cells.push(
            new TableCell({
              children: cellParagraphs,
              shading: cellNode.type === 'tableHeader' ? { fill: 'F0F4F8' } : undefined,
              margins: {
                top: convertMillimetersToTwip(2),
                bottom: convertMillimetersToTwip(2),
                left: convertMillimetersToTwip(3),
                right: convertMillimetersToTwip(3),
              },
            })
          );
        }

        rows.push(new TableRow({ children: cells }));
      }
    }
  }

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
  });
}
