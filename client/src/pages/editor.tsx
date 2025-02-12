import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Row } from '@/components/editor/row';
import { JsonPreview } from '@/components/editor/json-preview';
import { sampleTemplate } from '@/lib/sample-data';

export default function Editor() {
  const [pageData, setPageData] = useState(sampleTemplate.pages[0]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setPageData((prevData) => {
        const rows = [...prevData.content.rows];
        const oldIndex = rows.findIndex(row => row.id === active.id);
        const newIndex = rows.findIndex(row => row.id === over.id);
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: arrayMove(rows, oldIndex, newIndex),
          },
        };
      });
    }
  };

  const handleBlockContentChange = (columnId: string, blockId: string, content: string) => {
    setPageData((prevData) => {
      const newRows = prevData.content.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          if (col.id === columnId) {
            return {
              ...col,
              content: col.content.map(block =>
                block.id === blockId
                  ? { ...block, innerHtmlOrText: content }
                  : block
              ),
            };
          }
          return col;
        }),
      }));

      return {
        ...prevData,
        content: {
          ...prevData.content,
          rows: newRows,
        },
      };
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Page Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pageData.content.rows.map(row => row.id)}
              strategy={verticalListSortingStrategy}
            >
              {pageData.content.rows.map(row => (
                <Row
                  key={row.id}
                  id={row.id}
                  columns={row.columns}
                  onBlockContentChange={handleBlockContentChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="lg:sticky lg:top-8">
          <JsonPreview data={pageData} />
        </div>
      </div>
    </div>
  );
}
