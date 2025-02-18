import { ComponentProps } from 'react';
import { DragIcon } from './drag-icon';
import { Expand } from 'lucide-react';

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
      className={` ${className} drag-control-button`}
      {...dragAttributes}
      {...dragListeners}
      {...props}
    >
      <Expand className="w-4 h-4" />
    </button>
  );
}
