import { useState } from 'react';
import { BaseBlock, BaseBlockProps } from './base-block';
import { Button } from 'react-bootstrap';
import { Settings2 } from 'lucide-react';
import { TableBuilder } from '../table-builder';

interface TableData {
  html: string;
  config: any;
}

interface TableBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function TableBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: TableBlockProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);

  const handleSave = (data: TableData) => {
    setTableData(data);
    onContentChange(data.html);
  };

  return (
    <BaseBlock {...baseProps}>
      <div className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setIsBuilderOpen(true)}
          >
            <Settings2 className="h-4 w-4 me-2" />
            Edit Table
          </Button>
        </div>
        <div 
          className="p-3 bg-light rounded"
          dangerouslySetInnerHTML={{ 
            __html: content || '<div class="text-muted text-center py-4">Click "Edit Table" to configure the table</div>' 
          }}
        />
      </div>
      <TableBuilder
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={handleSave}
        initialData={tableData?.config}
      />
    </BaseBlock>
  );
}