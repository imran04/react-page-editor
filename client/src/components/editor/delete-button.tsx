import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}

export function DeleteButton({ onDelete, className = '' }: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={` hover:bg-destructive/10 ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(e);
      }}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
