import { useCallback, useState } from 'react';
import { useDndMonitor, DndContext, DragOverlay } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FormField } from './form-builder';

interface FormGridLayoutProps {
  fields: FormField[];
  onFieldMove: (id: string, position: { row: number; column: number }) => void;
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
    const cell = over.id;
    if (cell.startsWith('cell-')) {
      const [_, row, col] = cell.split('-').map(Number);
      onFieldMove(fieldId, { row, column: col });
    }
  }, [onFieldMove]);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      <div style={gridStyle}>
        {/* Generate grid cells */}
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: GRID_COLUMNS }).map((_, col) => (
            <div
              key={`cell-${row}-${col}`}
              id={`cell-${row}-${col}`}
              style={{
                height: CELL_SIZE,
                border: '1px dashed hsl(var(--border))',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          ))
        )}

        {/* Render fields */}
        {fields.map(field => (
          <FormFieldItem
            key={field.id}
            field={field}
            style={{
              gridColumn: `span ${field.gridPosition?.width || 1}`,
              gridRow: field.gridPosition?.row || 'auto',
              gridColumnStart: field.gridPosition?.column || 'auto',
            }}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <Card className="p-4 w-64">
            {fields.find(f => f.id === activeId)?.label}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function FormFieldItem({ field, style }: { field: FormField; style: React.CSSProperties }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
  });

  const itemStyle = {
    ...style,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={itemStyle}
      className="p-4"
      {...attributes}
      {...listeners}
    >
      <Label>{field.label}</Label>
      {/* Field preview based on type */}
    </Card>
  );
}
