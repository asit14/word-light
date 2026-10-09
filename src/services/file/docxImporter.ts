import mammoth from 'mammoth';

export interface DocxImportResult {
  html: string;
  messages: string[];
  title?: string;
}

export async function importDocxFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<DocxImportResult> {
  const options = {
    // Custom style mapping for Headings and styles
    styleMap: [
      "p[style-name='Title'] => h1.title:fresh",
      "p[style-name='Subtitle'] => p.subtitle:fresh",
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Quote'] => blockquote:fresh",
    ],
    // Convert embedded images to base64 inline data URIs
    convertImage: mammoth.images.imgElement(async (image) => {
      const imageBuffer = await image.read('base64');
      const contentType = image.contentType;
      return {
        src: `data:${contentType};base64,${imageBuffer}`,
      };
    }),
  };

  const buf =
    typeof Buffer !== 'undefined' && Buffer.isBuffer(arrayBuffer)
      ? arrayBuffer
      : typeof Buffer !== 'undefined'
      ? Buffer.from(arrayBuffer)
      : (arrayBuffer as any);

  const result = await mammoth.convertToHtml({ buffer: buf, arrayBuffer } as any, options);

  return {
    html: result.value,
    messages: result.messages.map((m) => m.message),
  };
}
