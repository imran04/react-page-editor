import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from './column';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface RowProps {
  id: string;
  columns: any[];
  onBlockContentChange: (columnId: string, blockId: string, content: string) => void;
  onAddColumn: (rowId: string) => void;
}

export function Row({ id, columns, onBlockContentChange, onAddColumn }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType === 'columns') {
      onAddColumn(id);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="p-4">
        <div className="mb-2 flex justify-center">
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
        <SortableContext
          items={columns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div 
            className="flex flex-wrap gap-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {columns.length === 0 ? (
              <div className="w-full h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Drop columns here</p>
              </div>
            ) : (
              columns.map(column => (
                <Column
                  key={column.id}
                  id={column.id}
                  type={column.type}
                  content={column.content}
                  onBlockContentChange={(blockId, content) =>
                    onBlockContentChange(column.id, blockId, content)
                  }
                />
              ))
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}