import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from './column';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RowProps {
  id: string;
  columns: any[];
  onBlockContentChange: (columnId: string, blockId: string, content: string) => void;
  onAddColumn: (rowId: string) => void;
  onRemoveBlock: (columnId: string, blockId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onRemoveRow: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function Row({ 
  id, 
  columns, 
  onBlockContentChange, 
  onAddColumn,
  onRemoveBlock,
  onRemoveColumn,
  onRemoveRow,
  isSelected,
  onSelect
}: RowProps) {
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
    <div 
      ref={setNodeRef} 
      style={style} 
      className="mb-4 relative group"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}>
        <div className="mb-2 flex justify-between">
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveRow();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
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
                  onRemoveBlock={(blockId) => onRemoveBlock(column.id, blockId)}
                  onRemoveColumn={() => onRemoveColumn(column.id)}
                  isSelected={isSelected} // Pass isSelected down to Column
                />
              ))
            )}
          </div>
        </SortableContext>
      </Card>
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-primary rounded-lg pointer-events-none" />
      )}
    </div>
  );
}