import { BaseBlock, BaseBlockProps } from './base-block';
import { TextEditor } from '../text-editor';
import { Table } from '@/components/ui/table';

interface TableBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function TableBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: TableBlockProps) {
  const defaultTable = `
    <table>
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
          <th>Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
          <td>Row 1, Cell 3</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
          <td>Row 2, Cell 3</td>
        </tr>
      </tbody>
    </table>
  `;

  const handleContentChange = (newContent: string) => {
    // Ensure content is wrapped in a table tag if it isn't already
    if (!newContent.match(/<table[^>]*>/)) {
      newContent = defaultTable;
    }
    onContentChange(newContent);
  };

  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-4">
        <TextEditor
          initialContent={content || defaultTable}
          onContentChange={handleContentChange}
        />
        <div className="border rounded-lg overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: content || defaultTable }} />
        </div>
      </div>
    </BaseBlock>
  );
}
