import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
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
import { PropertiesPanel } from '@/components/editor/properties-panel';

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

export default function Editor() {
  const [pageData, setPageData] = useState(sampleTemplate.pages[0]);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Selection | null>(null);
  const [showBorders, setShowBorders] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
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
          const columnCount = row.columns.length;
          let columnType = 'col-6'; 

          if (columnCount === 0) {
            columnType = 'col-12'; 
          } else if (columnCount === 1) {
            row.columns[0].type = 'col-6';
          }

          const newColumn = {
            id: `col-${nanoid()}`,
            type: columnType,
            styles: {},
            attributes: {},
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
            styles: {},
            attributes: {},
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
    setSelectedElement(prev => {
      if (prev?.id === id && prev.type === type) {
        return null;
      }
      return { type, id };
    });
  };

  const handleUpdateStyles = (styles: Record<string, string>) => {
    if (!selectedElement) return;

    setPageData((prevData) => {
      if (selectedElement.type === 'row') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row =>
              row.id === selectedElement.id
                ? { ...row, styles: { ...(row.styles || {}), ...styles } }
                : row
            )
          }
        };
      }

      if (selectedElement.type === 'column') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row => ({
              ...row,
              columns: row.columns.map(col =>
                col.id === selectedElement.id
                  ? { ...col, styles: { ...(col.styles || {}), ...styles } }
                  : col
              )
            }))
          }
        };
      }

      if (selectedElement.type === 'block') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row => ({
              ...row,
              columns: row.columns.map(col => ({
                ...col,
                content: col.content.map(block =>
                  block.id === selectedElement.id
                    ? { ...block, styles: { ...(block.styles || {}), ...styles } }
                    : block
                )
              }))
            }))
          }
        };
      }

      return prevData;
    });
  };

  const handleUpdateAttributes = (attributes: Record<string, string>) => {
    if (!selectedElement) return;

    setPageData((prevData) => {
      if (selectedElement.type === 'row') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row =>
              row.id === selectedElement.id
                ? { ...row, attributes: { ...(row.attributes || {}), ...attributes } }
                : row
            )
          }
        };
      }

      if (selectedElement.type === 'column') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row => ({
              ...row,
              columns: row.columns.map(col =>
                col.id === selectedElement.id
                  ? { ...col, attributes: { ...(col.attributes || {}), ...attributes } }
                  : col
              )
            }))
          }
        };
      }

      if (selectedElement.type === 'block') {
        return {
          ...prevData,
          content: {
            ...prevData.content,
            rows: prevData.content.rows.map(row => ({
              ...row,
              columns: row.columns.map(col => ({
                ...col,
                content: col.content.map(block =>
                  block.id === selectedElement.id
                    ? { ...block, attributes: { ...(block.attributes || {}), ...attributes } }
                    : block
                )
              }))
            }))
          }
        };
      }

      return prevData;
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
        <div className={`flex-1 overflow-auto p-8 ${selectedElement ? 'mr-80' : ''}`}>
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
                  onClick={() => setShowBorders(!showBorders)}
                  className="gap-2"
                >
                  {showBorders ? 'Hide' : 'Show'} Borders
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
              onDragStart={handleDragStart}
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
                      onColumnSelect={(columnId) => handleSelect('column', columnId)}
                      onBlockSelect={(blockId) => handleSelect('block', blockId)}
                      selectedElement={selectedElement}
                      styles={row.styles}
                      attributes={row.attributes}
                      showBorders={showBorders || isDragging}
                    />
                  ))
                )}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Properties Panel */}
        <div 
          className={`fixed right-0 top-0 bottom-0 w-80 border-l bg-background transform transition-transform duration-200 ease-in-out ${
            selectedElement ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 h-full">
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdateStyles={handleUpdateStyles}
              onUpdateAttributes={handleUpdateAttributes}
            />
          </div>
        </div>

        {/* JSON Preview Panel */}
        <div
          className={`fixed right-0 top-0 bottom-0 w-96 border-l bg-background overflow-auto transition-all duration-300 ease-in-out ${
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