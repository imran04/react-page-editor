import { useState } from 'react';
import { BaseBlock, BaseBlockProps } from './base-block';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { TableBuilder } from '../table-builder';

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

  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBuilderOpen(true)}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Edit Table
          </Button>
        </div>
        <div 
          className="p-4 bg-muted/50 rounded-lg overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: content || '<div class="text-muted-foreground text-center py-4">Click "Edit Table" to configure the table</div>' }}
        />
      </div>
      <TableBuilder
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={onContentChange}
        initialData={undefined} // TODO: Parse existing HTML back to table data
      />
    </BaseBlock>
  );
}