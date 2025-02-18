import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { DragHandle } from './drag-handle';
import { DeleteButton } from './delete-button';
import { getBlockComponent } from './blocks/block-registry';

interface BlockContent {
  id: string;
  blocktype: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  innerHtmlOrText: string;
}

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

interface ColumnProps {
  id: string;
  type: string;
  content: BlockContent[];
  onBlockContentChange: (columnId: string, blockId: string, content: string) => void;
  onAddBlock: (columnId: string, blockType: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onRemoveColumn: () => void;
  isSelected: boolean;
  onSelect: () => void;
  onBlockSelect: (blockId: string) => void;
  selectedElement: Selection | null;
  styles?: Record<string, string>;
  attributes?: Record<string, string>;
  showBorders: boolean;
}

export function Column({
  id,
  type,
  content,
  onBlockContentChange,
  onAddBlock,
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
    attributes: dragAttributes,
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
      onAddBlock(id, blockType);
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
      {...dragAttributes}
    >
      <Card
        className={`p-4 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dotted' : ''} transition-all duration-200`}
        style={styles}
      >
        <div className={`mb-2 flex items-center justify-between toolbar-draggable ${isSelected ? 'selected' : ''}`}>
          <DragHandle dragListeners={listeners} />
          <DeleteButton onDelete={onRemoveColumn} />
        </div>

        <div
          className="space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {content.length === 0 ? (
            <div className="h-24 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center transition-colors duration-200">
              <p className="text-muted-foreground">Drop blocks here</p>
            </div>
          ) : (
            content.map(block => {
              const BlockComponent = getBlockComponent(block.blocktype);
              if (!BlockComponent) {
                return (
                  <div key={block.id} className="p-2 bg-warning/10 text-warning">
                    Unknown block type: {block.blocktype}
                  </div>
                );
              }

              return (
                <BlockComponent
                  key={block.id}
                  id={block.id}
                  onRemove={() => onRemoveBlock(block.id)}
                  isSelected={selectedElement?.type === 'block' && selectedElement.id === block.id}
                  onSelect={() => onBlockSelect(block.id)}
                  styles={block.styles || {}}
                  attributes={block.attributes || {}}
                  showBorders={showBorders}
                  content={block.innerHtmlOrText}
                  onContentChange={(content: string) => onBlockContentChange(id, block.id, content)}
                  onAttributesChange={() => {}} 
                />
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}