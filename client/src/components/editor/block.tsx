import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextEditor } from './text-editor';
import { Card } from '@/components/ui/card';
import { DragHandle } from './drag-handle';
import { DeleteButton } from './delete-button';

interface BlockStyles {
  [key: string]: string;
}

interface BlockAttributes {
  [key: string]: string;
}

interface BlockProps {
  id: string;
  content: string;
  onContentChange: (content: string) => void;
  onRemove: () => void;
  isSelected: boolean;
  onSelect: () => void;
  styles?: BlockStyles;
  attributes?: BlockAttributes;
  showBorders: boolean;
}

export function Block({ 
  id, 
  content, 
  onContentChange, 
  onRemove, 
  isSelected, 
  onSelect, 
  styles = {}, 
  attributes = {},
  showBorders,
}: BlockProps) {
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, ...styles }} 
      className="mb-4 relative"
      onClick={handleClick}
      {...attributes}
      {...dragAttributes}
    >
      <Card className={`p-2 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dotted' : ''} transition-all duration-200`}>
        <div className="flex items-start gap-2">
          <DragHandle 
            dragListeners={listeners}
          />
          <div className="flex-1">
            <TextEditor
              initialContent={content}
              onContentChange={onContentChange}
            />
          </div>
          <DeleteButton onDelete={onRemove} />
        </div>
      </Card>
    </div>
  );
}