import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextEditor } from './text-editor';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragIcon } from './drag-icon';

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
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            {...listeners}
          >
            <DragIcon className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <TextEditor
              initialContent={content}
              onContentChange={onContentChange}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}