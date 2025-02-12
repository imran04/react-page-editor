import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Type, Columns, Image } from 'lucide-react';

interface BlockTemplate {
  type: string;
  icon: JSX.Element;
  label: string;
}

const blocks: BlockTemplate[] = [
  {
    type: 'text',
    icon: <Type className="h-4 w-4" />,
    label: 'Text Block'
  },
  {
    type: 'columns',
    icon: <Columns className="h-4 w-4" />,
    label: 'Columns'
  },
  {
    type: 'image',
    icon: <Image className="h-4 w-4" />,
    label: 'Image'
  }
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, blockType: string) => {
    event.dataTransfer.setData('blockType', blockType);
  };

  return (
    <Card className="p-4 h-full">
      <h2 className="font-semibold mb-4">Content Blocks</h2>
      <div className="space-y-2">
        {blocks.map((block) => (
          <Button
            key={block.type}
            variant="outline"
            className="w-full justify-start gap-2"
            draggable
            onDragStart={(e) => onDragStart(e, block.type)}
          >
            {block.icon}
            {block.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
