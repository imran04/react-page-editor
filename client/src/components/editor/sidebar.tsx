import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Type, 
  Image, 
  Heading, 
  Link2, 
  Table, 
  FormInput,
  Code,
  MousePointer2
} from 'lucide-react';
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
  description?: string;
}

const contentBlocks: BlockTemplate[] = [
  {
    type: 'heading',
    icon: <Heading className="h-4 w-4" />,
    label: 'Heading'
  },
  {
    type: 'text',
    icon: <Type className="h-4 w-4" />,
    label: 'Text Block'
  },
  {
    type: 'button',
    icon: <MousePointer2 className="h-4 w-4" />,
    label: 'Button'
  },
  {
    type: 'link',
    icon: <Link2 className="h-4 w-4" />,
    label: 'Link'
  },
  {
    type: 'image',
    icon: <Image className="h-4 w-4" />,
    label: 'Image'
  },
  {
    type: 'form',
    icon: <FormInput className="h-4 w-4" />,
    label: 'Form'
  },
  {
    type: 'table',
    icon: <Table className="h-4 w-4" />,
    label: 'Table'
  },
  {
    type: 'html',
    icon: <Code className="h-4 w-4" />,
    label: 'HTML'
  }
];

const columnLayouts: ColumnLayout[] = [
  // Full width layouts
  {
    type: 'full-width',
    label: 'Full Width',
    columns: ['col-12'],
    description: 'Single column (12/12)'
  },
  // Two column layouts
  {
    type: 'two-equal',
    label: 'Two Equal Columns',
    columns: ['col-6', 'col-6'],
    description: 'Two columns (6/6)'
  },
  {
    type: 'two-unequal-1',
    label: 'Two Unequal Columns',
    columns: ['col-8', 'col-4'],
    description: 'Two columns (8/4)'
  },
  {
    type: 'two-unequal-2',
    label: 'Two Unequal Columns',
    columns: ['col-4', 'col-8'],
    description: 'Two columns (4/8)'
  },
  // Three column layouts
  {
    type: 'three-equal',
    label: 'Three Equal Columns',
    columns: ['col-4', 'col-4', 'col-4'],
    description: 'Three columns (4/4/4)'
  },
  {
    type: 'three-unequal-1',
    label: 'Three Unequal Columns',
    columns: ['col-3', 'col-6', 'col-3'],
    description: 'Three columns (3/6/3)'
  },
  {
    type: 'three-unequal-2',
    label: 'Three Unequal Columns',
    columns: ['col-2', 'col-8', 'col-2'],
    description: 'Three columns (2/8/2)'
  },
  // Four column layouts
  {
    type: 'four-equal',
    label: 'Four Equal Columns',
    columns: ['col-3', 'col-3', 'col-3', 'col-3'],
    description: 'Four columns (3/3/3/3)'
  },
  // Six column layouts
  {
    type: 'six-equal',
    label: 'Six Equal Columns',
    columns: ['col-2', 'col-2', 'col-2', 'col-2', 'col-2', 'col-2'],
    description: 'Six columns (2/2/2/2/2/2)'
  }
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, layout: ColumnLayout) => {
    event.dataTransfer.setData('layout', JSON.stringify(layout));
  };

  const onBlockDragStart = (event: React.DragEvent, blockType: string) => {
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
              onDragStart={(e) => onDragStart(e, layout)}
            >
              <div className="flex-1">
                <div className="font-medium">{layout.label}</div>
                <div className="text-xs text-muted-foreground">
                  {layout.description || layout.columns.join(' + ')}
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
              onDragStart={(e) => onBlockDragStart(e, block.type)}
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