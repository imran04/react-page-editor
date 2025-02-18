import { useCallback, useState } from 'react';
import { useDndMonitor, DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Card, Form } from 'react-bootstrap';
import { FormField } from './form-builder';
import { Button } from 'react-bootstrap';
import { GripHorizontal } from 'lucide-react';

interface FormGridLayoutProps {
  fields: FormField[];
  onFieldMove: (id: string, position: { row: number; column: number; width: number }) => void;
  onAddBlock: (id: string, blockType: string) => void; // Assumed to exist
  onAddColumn: (id: string, column: string) => void; // Assumed to exist
}

const GRID_COLUMNS = 12;
const CELL_SIZE = 64; // pixels

export function FormGridLayout({ fields, onFieldMove, onAddBlock, onAddColumn }: FormGridLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
    gap: '1rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '0.375rem',
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-primary/10');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-primary/10');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-primary/10');

    const blockType = e.dataTransfer.getData('blockType');
    if (blockType) {
      onAddBlock(e.currentTarget.id, blockType); // Assuming id is available on the target
    }
  };


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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
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
          <Card className="p-4" style={{ width: '16rem', opacity: 0.8 }}>
            {fields.find(f => f.id === activeId)?.label}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function GridCell({ id, row, column, onDragOver, onDragLeave, onDrop }: { id: string; row: number; column: number; onDragOver: (e: React.DragEvent) => void; onDragLeave: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        height: CELL_SIZE,
        border: '1px dashed var(--bs-border-color)',
        borderRadius: '0.375rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isOver ? 'var(--bs-primary-bg-subtle)' : undefined,
        opacity: isOver ? 0.5 : undefined,
        transition: 'background-color 0.2s, opacity 0.2s',
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
      <div className="d-flex align-items-center justify-content-between gap-4 mb-2">
        <div {...listeners} className="cursor-move">
          <GripHorizontal className="h-4 w-4 text-muted" />
        </div>
        <div className="flex-1">
          <Form.Label>{field.label}</Form.Label>
          {field.placeholder && (
            <p className="text-muted small">{field.placeholder}</p>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Label className="small">Width</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="12"
            value={gridPosition.width}
            onChange={(e) => onWidthChange(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16"
            size="sm"
          />
        </div>
      </div>

      {/* Field preview */}
      <div className="opacity-50">
        {field.type === 'text' && <Form.Control disabled placeholder={field.placeholder} />}
        {/* Add more field type previews as needed */}
      </div>
    </Card>
  );
}