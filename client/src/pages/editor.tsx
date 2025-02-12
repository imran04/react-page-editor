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
import { Sidebar } from '@/components/editor/sidebar';
import { sampleTemplate } from '@/lib/sample-data';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

export default function Editor() {
  const [pageData, setPageData] = useState(sampleTemplate.pages[0]);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

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
    <div className="flex h-screen bg-muted/10">
      {/* Sidebar */}
      <div className="w-64 p-4 border-r bg-background">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Page Editor</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="gap-2"
              >
                <Code className="h-4 w-4" />
                {showJsonPreview ? 'Hide' : 'Show'} JSON
              </Button>
            </div>

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
        </div>

        {/* JSON Preview Panel */}
        <div 
          className={`w-96 border-l bg-background overflow-auto transition-all duration-300 ease-in-out ${
            showJsonPreview ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4">
            <JsonPreview data={pageData} />
          </div>
        </div>
      </div>
    </div>
  );
}