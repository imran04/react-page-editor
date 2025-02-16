import { Card } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

interface HtmlPreviewProps {
  data: any;
}

export function HtmlPreview({ data }: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = generateHtml(data);
    const iframe = iframeRef.current;
    iframe.srcdoc = html;
  }, [data]);

  const generateHtml = (pageData: any) => {
    const generateBlockHtml = (block: any) => {
      const styleAttr = block.styles ? ` style="${Object.entries(block.styles).map(([k, v]) => `${k}:${v}`).join(';')}"` : '';
      
      switch (block.blocktype.toLowerCase()) {
        case 'text':
          return `<div class="content-block"${styleAttr}>${block.innerHtmlOrText}</div>`;
        case 'image':
          return `<div class="content-block"${styleAttr}><img src="${block.innerHtmlOrText}" class="img-fluid" alt="Content image"></div>`;
        default:
          return `<div class="content-block"${styleAttr}>${block.innerHtmlOrText}</div>`;
      }
    };

    const rows = pageData.content.rows.map((row: any) => {
      const columns = row.columns.map((col: any) => {
        const bootstrapColClass = col.type.replace('col-', 'col-md-');
        const blocks = col.content.map((block: any) => generateBlockHtml(block)).join('\n');
        return `
          <div class="${bootstrapColClass}">
            ${blocks}
          </div>
        `;
      }).join('\n');

      return `
        <div class="row my-4">
          ${columns}
        </div>
      `;
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageData.metadata.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          ${rows}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
      </html>
    `;
  };

  return (
    <Card className="bg-muted p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">HTML Preview</h3>
      <div className="w-full h-[calc(100vh-10rem)] bg-white rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Page Preview"
        />
      </div>
    </Card>
  );
}
