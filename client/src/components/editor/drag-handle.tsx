import { ComponentProps } from 'react';
import { DragIcon } from './drag-icon';

interface DragHandleProps extends ComponentProps<'button'> {
  dragListeners?: any;
  dragAttributes?: any;
}

export function DragHandle({ 
  dragListeners, 
  dragAttributes,
  className = '',
  ...props 
}: DragHandleProps) {
  return (
    <button
      className={`p-2 hover:bg-muted rounded cursor-move ${className}`}
      {...dragAttributes}
      {...dragListeners}
      {...props}
    >
      <DragIcon className="w-4 h-4" />
    </button>
  );
}
