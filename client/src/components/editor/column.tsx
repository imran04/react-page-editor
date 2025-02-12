import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './block';
import { Card } from '@/components/ui/card';
import { GripHorizontal } from 'lucide-react';

interface ColumnProps {
  id: string;
  type: string;
  content: any[];
  onBlockContentChange: (blockId: string, content: string) => void;
}

export function Column({ id, type, content, onBlockContentChange }: ColumnProps) {
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
        <div className="mb-2 flex items-center justify-center">
          <button
            className="p-2 hover:bg-muted rounded cursor-move"
            {...attributes}
            {...listeners}
          >
            <GripHorizontal className="w-4 h-4" />
          </button>
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
            />
          ))}
        </SortableContext>
      </Card>
    </div>
  );
}
