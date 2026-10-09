import { Node, mergeAttributes } from '@tiptap/core';

export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-page-break="true"]',
      },
      {
        tag: 'hr.wordlite-page-break',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        class: 'wordlite-page-break',
      }),
      [
        'div',
        { class: 'page-break-indicator' },
        ['span', { class: 'page-break-line' }],
        ['span', { class: 'page-break-badge' }, 'Page Break'],
        ['span', { class: 'page-break-line' }],
      ],
    ];
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent([
              { type: this.name },
              { type: 'paragraph' },
            ])
            .run();
        },
      insertBlankPage:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent([
              { type: this.name },
              { type: 'paragraph' },
            ])
            .focus()
            .run();
        },
    };
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
      insertBlankPage: () => ReturnType;
    };
  }
}
