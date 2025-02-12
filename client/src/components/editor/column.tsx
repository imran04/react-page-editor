import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './block';
import { Card } from '@/components/ui/card';
import { GripHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnProps {
  id: string;
  type: string;
  content: any[];
  onBlockContentChange: (blockId: string, content: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onRemoveColumn: () => void;
}

export function Column({ 
  id, 
  type, 
  content, 
  onBlockContentChange, 
  onRemoveBlock,
  onRemoveColumn 
}: ColumnProps) {
  const {
    attributes,
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
    <div ref={setNodeRef} style={style} className={type}>
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            {...attributes}
            {...listeners}
          >
            <GripHorizontal className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onRemoveColumn}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <SortableContext
          items={content.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {content.map(block => (
            <Block
              key={block.id}
              id={block.id}
              content={block.innerHtmlOrText}
              onContentChange={(content) => onBlockContentChange(block.id, content)}
              onRemove={() => onRemoveBlock(block.id)}
            />
          ))}
        </SortableContext>
      </Card>
    </div>
  );
}