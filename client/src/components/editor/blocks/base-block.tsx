import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { DragHandle } from '../drag-handle';
import { DeleteButton } from '../delete-button';

export interface BlockStyles {
  [key: string]: string;
}

export interface BlockAttributes {
  [key: string]: string;
}

export interface BaseBlockProps {
  id: string;
  onRemove: () => void;
  isSelected: boolean;
  onSelect: () => void;
  styles?: BlockStyles;
  attributes?: BlockAttributes;
  showBorders: boolean;
}

export function BaseBlock({ 
  id, 
  onRemove, 
  isSelected, 
  onSelect, 
  styles = {}, 
  attributes = {},
  showBorders,
  children
}: BaseBlockProps & { children: React.ReactNode }) {
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
      className="mb-4 relative block-container"
      onClick={handleClick}
      {...attributes}
      {...dragAttributes}
    >
      <Card className={`p-2 ${isSelected && showBorders ? 'ring-2 ring-primary ring-dotted' : ''} transition-all duration-200`}>
        <div className="flex items-start gap-2">
          <DragHandle dragListeners={listeners} />
          <div className="flex-1 block-content">
            {children}
          </div>
          <DeleteButton onDelete={onRemove} />
        </div>
      </Card>
    </div>
  );
}