import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from './column';
import { Card } from '@/components/ui/card';
import { DragHandle } from './drag-handle';
import { DeleteButton } from './delete-button';

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

interface RowStyles {
  [key: string]: string;
}

interface RowAttributes {
  [key: string]: string;
}

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
  onColumnSelect: (columnId: string) => void;
  onBlockSelect: (blockId: string) => void;
  selectedElement: Selection | null;
  styles?: RowStyles;
  attributes?: RowAttributes;
  showBorders: boolean;
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
  onSelect,
  onColumnSelect,
  onBlockSelect,
  selectedElement,
  styles = {},
  attributes = {},
  showBorders,
}: RowProps) {
  const {
    attributes: sortableAttributes,
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

  // Calculate total columns to ensure we don't exceed 12
  const totalColumns = columns.reduce((acc, col) => {
    const colSize = parseInt(col.type.replace('col-', ''));
    return acc + colSize;
  }, 0);

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, ...styles }} 
      className="mb-4 relative group"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
      {...sortableAttributes}
    >
      <Card className={`p-4 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dashed' : ''} transition-all duration-200`}>
        <div className="mb-2 flex justify-between items-center">
          <DragHandle dragListeners={listeners} />
          <div className="text-xs text-muted-foreground">
            {totalColumns}/12 columns used
          </div>
          <DeleteButton onDelete={onRemoveRow} />
        </div>
        <SortableContext
          items={columns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div 
            className="flex flex-wrap -mx-2" // Bootstrap-style row margins
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {columns.length === 0 ? (
              <div className="w-full px-2"> {/* Bootstrap padding */}
                <div className="h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Drop columns here</p>
                </div>
              </div>
            ) : (
              columns.map(column => (
                <div key={column.id} className="px-2"> {/* Bootstrap padding */}
                  <Column
                    id={column.id}
                    type={column.type}
                    content={column.content}
                    onBlockContentChange={(blockId, content) =>
                      onBlockContentChange(column.id, blockId, content)
                    }
                    onRemoveBlock={(blockId) => onRemoveBlock(column.id, blockId)}
                    onRemoveColumn={() => onRemoveColumn(column.id)}
                    isSelected={selectedElement?.type === 'column' && selectedElement.id === column.id}
                    onSelect={() => onColumnSelect(column.id)}
                    onBlockSelect={onBlockSelect}
                    selectedElement={selectedElement}
                    styles={column.styles || {}}
                    attributes={column.attributes || {}}
                    showBorders={showBorders}
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}