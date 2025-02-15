import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextEditor } from './text-editor';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

export function Block({ id, content, onContentChange, onRemove, isSelected, onSelect, styles = {}, attributes = {} }: BlockProps) {
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

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, ...styles }} 
      className="mb-4 relative"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
      {...dragAttributes}
      {...listeners}
    >
      <Card className={`p-2 ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}>
        <div className="flex items-start gap-2">
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            
          >
            <GripVertical className="w-4 h-4" />
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
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-primary rounded-lg pointer-events-none" />
      )}
    </div>
  );
}