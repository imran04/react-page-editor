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
import { nanoid } from 'nanoid';

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

export default function Editor() {
  const [pageData, setPageData] = useState(sampleTemplate.pages[0]);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Selection | null>(null);

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

  const handleAddColumn = (rowId: string) => {
    setPageData((prevData) => {
      const newRows = prevData.content.rows.map(row => {
        if (row.id === rowId) {
          const newColumn = {
            id: `col-${nanoid()}`,
            type: 'col-6',
            content: []
          };
          return {
            ...row,
            columns: [...row.columns, newColumn]
          };
        }
        return row;
      });

      return {
        ...prevData,
        content: {
          ...prevData.content,
          rows: newRows
        }
      };
    });
  };

  const handleAddRow = () => {
    setPageData((prevData) => ({
      ...prevData,
      content: {
        ...prevData.content,
        rows: [
          ...prevData.content.rows,
          {
            id: `row-${nanoid()}`,
            columns: []
          }
        ]
      }
    }));
  };

  const handleRemoveBlock = (columnId: string, blockId: string) => {
    setSelectedElement(null);
    setPageData((prevData) => {
      const newRows = prevData.content.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          if (col.id === columnId) {
            return {
              ...col,
              content: col.content.filter(block => block.id !== blockId)
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

  const handleRemoveColumn = (columnId: string) => {
    setSelectedElement(null);
    setPageData((prevData) => {
      const newRows = prevData.content.rows.map(row => ({
        ...row,
        columns: row.columns.filter(col => col.id !== columnId)
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

  const handleRemoveRow = (rowId: string) => {
    setSelectedElement(null);
    setPageData((prevData) => ({
      ...prevData,
      content: {
        ...prevData.content,
        rows: prevData.content.rows.filter(row => row.id !== rowId)
      }
    }));
  };

  const handleSelect = (type: 'row' | 'column' | 'block', id: string) => {
    setSelectedElement(prev => 
      prev?.id === id ? null : { type, id }
    );
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleAddRow}
                  className="gap-2"
                >
                  Add Row
                </Button>
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
                {pageData.content.rows.length === 0 ? (
                  <div 
                    className="h-32 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const blockType = e.dataTransfer.getData('blockType');
                      if (blockType === 'columns') {
                        handleAddRow();
                      }
                    }}
                  >
                    <p className="text-muted-foreground">Drop columns here or click "Add Row" to create a new row</p>
                  </div>
                ) : (
                  pageData.content.rows.map(row => (
                    <Row
                      key={row.id}
                      id={row.id}
                      columns={row.columns}
                      onBlockContentChange={handleBlockContentChange}
                      onAddColumn={handleAddColumn}
                      onRemoveBlock={handleRemoveBlock}
                      onRemoveColumn={handleRemoveColumn}
                      onRemoveRow={() => handleRemoveRow(row.id)}
                      isSelected={selectedElement?.type === 'row' && selectedElement.id === row.id}
                      onSelect={() => handleSelect('row', row.id)}
                    />
                  ))
                )}
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