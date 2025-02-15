import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './block';
import { Card } from '@/components/ui/card';
import { DragHandle } from './drag-handle';
import { DeleteButton } from './delete-button';
import { nanoid } from 'nanoid';

interface ColumnStyles {
  [key: string]: string;
}

interface ColumnAttributes {
  [key: string]: string;
}

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

interface ColumnProps {
  id: string;
  type: string;
  content: any[];
  onBlockContentChange: (blockId: string, content: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onRemoveColumn: () => void;
  isSelected: boolean;
  onSelect: () => void;
  onBlockSelect: (blockId: string) => void;
  selectedElement: Selection | null;
  styles?: ColumnStyles;
  attributes?: ColumnAttributes;
  showBorders: boolean;
}

export function Column({
  id,
  type,
  content,
  onBlockContentChange,
  onRemoveBlock,
  onRemoveColumn,
  isSelected,
  onSelect,
  onBlockSelect,
  selectedElement,
  styles = {},
  attributes = {},
  showBorders,
}: ColumnProps) {
  const {
    attributes: dndAttributes,
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
      const newBlock = {
        id: `block-${nanoid()}`,
        blocktype: blockType,
        styles: {},
        attributes: {},
        innerHtmlOrText: blockType === 'text' ? '<p>New text block</p>' : ''
      };

      // Update content array with the new block
      const updatedContent = [...content, newBlock];
      onBlockContentChange(newBlock.id, newBlock.innerHtmlOrText);
    }
  };

  const columnClasses = type ? `${type}` : 'w-full';

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      className={`${columnClasses} relative group`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
    >
      <Card 
        className={`p-4 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dotted' : ''} transition-all duration-200`}
        style={styles}
      >
        <div className="mb-2 flex items-center justify-between">
          <DragHandle 
            dragListeners={listeners}
            dragAttributes={dndAttributes}
          />
          <DeleteButton onDelete={onRemoveColumn} />
        </div>
        <SortableContext
          items={content.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div 
            className="space-y-4"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {content.length === 0 ? (
              <div
                className="h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p className="text-muted-foreground">Drop blocks here</p>
              </div>
            ) : (
              content.map(block => (
                <Block
                  key={block.id}
                  id={block.id}
                  content={block.innerHtmlOrText}
                  onContentChange={(content) => onBlockContentChange(block.id, content)}
                  onRemove={() => onRemoveBlock(block.id)}
                  isSelected={selectedElement?.type === 'block' && selectedElement.id === block.id}
                  onSelect={() => onBlockSelect(block.id)}
                  styles={block.styles || {}}
                  attributes={block.attributes || {}}
                  showBorders={showBorders}
                />
              ))
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}