import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from './column';
import { Card } from '@/components/ui/card';
import { DragHandle } from './drag-handle';
import { DeleteButton } from './delete-button';
import React from 'react';

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
  onAddBlock: (columnId: string, blockType: string) => void;
  onAddColumn: (rowId: string,columnLayout: string) => void;
  onRemoveBlock: (columnId: string, blockId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onRemoveRow: () => void;
  isSelected: boolean;
  mouseOver: boolean;
  onSelect: () => void;
  onColumnSelect: (columnId: string) => void;
  onBlockSelect: (blockId: string) => void;
  selectedElement: Selection | null;
  styles?: Record<string, string>;
  attributes?: Record<string, string>;
  showBorders: boolean;
}

export function Row({
  id,
  columns,
  onBlockContentChange,
  onAddBlock,
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
    transition
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const layoutData = e.dataTransfer.getData('layout');
    if (layoutData) {
      try {
        const layout = JSON.parse(layoutData);
        layout.columns.forEach((s: string) => onAddColumn(id, s));
      } catch {
        // Silently handle parsing errors
        return;
      }
    }
  };

  const [mouseOver, setMouseOver] = React.useState(false);
  // Calculate total columns to ensure we don't exceed 12
  const totalColumns = columns.reduce((acc, col) => {
    const colSize = parseInt(col.type.replace('col-', ''));
    return acc + colSize;
  }, 0);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...styles }}
      className="mb-4 relative group rw"
      onClick={(e) => {
      e.stopPropagation();
      onSelect();
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      {...attributes}
      {...sortableAttributes}
    >
      <Card className={`p-4 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dashed' : ''} transition-all duration-200`}>
        <div className={`mb-2 flex justify-between items-center toolbar-draggable ${isSelected|| mouseOver ? 'selected' : ''}`}>
          <DragHandle dragListeners={listeners} />
          <div className="text-xs ">
            {totalColumns}/12 columns used
          </div>
          <DeleteButton onDelete={onRemoveRow} />
        </div>
        <SortableContext
          items={columns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="flex flex-wrap -mx-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {columns.length === 0 ? (
              <div className="w-full px-2">
                <div className="h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Drop columns here</p>
                </div>
              </div>
            ) : (
              columns.map(column => (
                <div key={column.id} className="px-2">
                  <Column
                    id={column.id}
                    type={column.type}
                    content={column.content}
                    onBlockContentChange={onBlockContentChange}
                    onAddBlock={onAddBlock}
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