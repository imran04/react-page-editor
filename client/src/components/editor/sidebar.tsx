import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Type, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlockTemplate {
  type: string;
  icon: JSX.Element;
  label: string;
}

interface ColumnLayout {
  type: string;
  label: string;
  columns: string[];
}

const contentBlocks: BlockTemplate[] = [
  {
    type: 'text',
    icon: <Type className="h-4 w-4" />,
    label: 'Text Block'
  },
  {
    type: 'image',
    icon: <Image className="h-4 w-4" />,
    label: 'Image'
  }
];

const columnLayouts: ColumnLayout[] = [
  {
    type: 'single',
    label: 'Full Width',
    columns: ['col-12']
  },
  {
    type: 'two-equal',
    label: 'Two Columns (50/50)',
    columns: ['col-6', 'col-6']
  },
  {
    type: 'three-equal',
    label: 'Three Columns',
    columns: ['col-4', 'col-4', 'col-4']
  },
  {
    type: 'four-equal',
    label: 'Four Columns',
    columns: ['col-3', 'col-3', 'col-3', 'col-3']
  },
  {
    type: 'sidebar-left',
    label: 'Sidebar Left',
    columns: ['col-3', 'col-9']
  },
  {
    type: 'sidebar-right',
    label: 'Sidebar Right',
    columns: ['col-9', 'col-3']
  },
  {
    type: 'three-unequal',
    label: 'Three Columns (25/50/25)',
    columns: ['col-3', 'col-6', 'col-3']
  }
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, blockType: string) => {
    event.dataTransfer.setData('blockType', blockType);
  };

  return (
    <Card className="p-4 h-full">
      <h2 className="font-semibold mb-4">Content Blocks</h2>
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="layout" className="flex-1">Layouts</TabsTrigger>
          <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-2">
          {columnLayouts.map((layout) => (
            <Button
              key={layout.type}
              variant="outline"
              className="w-full justify-start gap-2 text-left"
              draggable
              onDragStart={(e) => onDragStart(e, 'columns')}
            >
              <div className="flex-1">
                <div className="font-medium">{layout.label}</div>
                <div className="text-xs text-muted-foreground">
                  {layout.columns.join(' + ')}
                </div>
              </div>
            </Button>
          ))}
        </TabsContent>

        <TabsContent value="blocks" className="space-y-2">
          {contentBlocks.map((block) => (
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
        </TabsContent>
      </Tabs>
    </Card>
  );
}