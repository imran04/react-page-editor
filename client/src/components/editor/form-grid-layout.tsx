import { useCallback, useState } from 'react';
import { useDndMonitor, DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormField } from './form-builder';
import { Button } from '@/components/ui/button';
import { GripHorizontal } from 'lucide-react';

interface FormGridLayoutProps {
  fields: FormField[];
  onFieldMove: (id: string, position: { row: number; column: number; width: number }) => void;
}

const GRID_COLUMNS = 12;
const CELL_SIZE = 64; // pixels

export function FormGridLayout({ fields, onFieldMove }: FormGridLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
    gap: '1rem',
    padding: '1rem',
    background: 'hsl(var(--muted))',
    borderRadius: 'calc(var(--radius) - 2px)',
    minHeight: '400px',
  };

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over) return;

    const fieldId = active.id;
    if (typeof over.id === 'string' && over.id.startsWith('cell-')) {
      const [_, row, col] = over.id.split('-').map(Number);
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        onFieldMove(fieldId, { 
          row, 
          column: col,
          width: field.gridPosition?.width || 1
        });
      }
    }
    setActiveId(null);
  }, [onFieldMove, fields]);

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div style={gridStyle}>
        {/* Generate grid cells */}
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: GRID_COLUMNS }).map((_, col) => (
            <GridCell
              key={`cell-${row}-${col}`}
              id={`cell-${row}-${col}`}
              row={row}
              column={col}
            />
          ))
        )}

        {/* Render fields */}
        {fields.map(field => (
          <FormFieldItem
            key={field.id}
            field={field}
            gridPosition={field.gridPosition || { row: 0, column: 0, width: 12 }}
            onWidthChange={(width) => 
              onFieldMove(field.id, {
                ...field.gridPosition!,
                width
              })
            }
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <Card className="p-4 w-64 opacity-80">
            {fields.find(f => f.id === activeId)?.label}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function GridCell({ id, row, column }: { id: string; row: number; column: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        height: CELL_SIZE,
        border: '1px dashed hsl(var(--border))',
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isOver ? 'hsl(var(--accent))' : undefined,
        opacity: isOver ? 0.5 : undefined,
        transition: 'background-color 0.2s, opacity 0.2s',
      }}
    />
  );
}

interface FormFieldItemProps {
  field: FormField;
  gridPosition: { row: number; column: number; width: number };
  onWidthChange: (width: number) => void;
}

function FormFieldItem({ field, gridPosition, onWidthChange }: FormFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    gridColumn: `${gridPosition.column + 1} / span ${gridPosition.width}`,
    gridRow: gridPosition.row + 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4"
      {...attributes}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div {...listeners} className="cursor-move">
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <Label>{field.label}</Label>
          {field.placeholder && (
            <p className="text-sm text-muted-foreground">{field.placeholder}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Width</Label>
          <Input
            type="number"
            min="1"
            max="12"
            value={gridPosition.width}
            onChange={(e) => onWidthChange(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16"
          />
        </div>
      </div>

      {/* Field preview */}
      <div className="opacity-50">
        {field.type === 'text' && <Input disabled placeholder={field.placeholder} />}
        {/* Add more field type previews as needed */}
      </div>
    </Card>
  );
}