import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Selection {
  type: 'row' | 'column' | 'block';
  id: string;
}

interface PropertiesPanelProps {
  selectedElement: Selection | null;
  onUpdateStyles: (styles: Record<string, string>) => void;
  onUpdateAttributes: (attributes: Record<string, string>) => void;
}

export function PropertiesPanel({ 
  selectedElement,
  onUpdateStyles,
  onUpdateAttributes
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <Card className="p-4 h-full">
        <p className="text-muted-foreground text-sm">Select an element to edit its properties</p>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Properties</h3>
        <p className="text-sm text-muted-foreground">
          Editing {selectedElement.type} {selectedElement.id}
        </p>
      </div>
      
      <Tabs defaultValue="styles" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <TabsContent value="styles" className="p-4">
            <div className="space-y-4">
              {selectedElement.type === 'column' && (
                <>
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <Select onValueChange={(value) => onUpdateStyles({ width: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="col-3">25%</SelectItem>
                        <SelectItem value="col-4">33%</SelectItem>
                        <SelectItem value="col-6">50%</SelectItem>
                        <SelectItem value="col-8">66%</SelectItem>
                        <SelectItem value="col-9">75%</SelectItem>
                        <SelectItem value="col-12">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                </>
              )}
              
              <div className="space-y-2">
                <Label>Padding</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Top" 
                    onChange={(e) => onUpdateStyles({ paddingTop: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Right"
                    onChange={(e) => onUpdateStyles({ paddingRight: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Bottom"
                    onChange={(e) => onUpdateStyles({ paddingBottom: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Left"
                    onChange={(e) => onUpdateStyles({ paddingLeft: `${e.target.value}px` })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Margin</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Top"
                    onChange={(e) => onUpdateStyles({ marginTop: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Right"
                    onChange={(e) => onUpdateStyles({ marginRight: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Bottom"
                    onChange={(e) => onUpdateStyles({ marginBottom: `${e.target.value}px` })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Left"
                    onChange={(e) => onUpdateStyles({ marginLeft: `${e.target.value}px` })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background</Label>
                <Input 
                  type="color" 
                  onChange={(e) => onUpdateStyles({ backgroundColor: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="p-4">
            <div className="space-y-4">
              {selectedElement.type === 'block' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contentEditable">Content Editable</Label>
                    <Switch 
                      id="contentEditable"
                      onCheckedChange={(checked) => 
                        onUpdateAttributes({ contentEditable: checked.toString() })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Class</Label>
                    <Input 
                      placeholder="Enter custom class names"
                      onChange={(e) => onUpdateAttributes({ className: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              {selectedElement.type === 'column' && (
                <div className="space-y-2">
                  <Label>Custom Class</Label>
                  <Input 
                    placeholder="Enter custom class names"
                    onChange={(e) => onUpdateAttributes({ className: e.target.value })}
                  />
                </div>
              )}

              {selectedElement.type === 'row' && (
                <div className="space-y-2">
                  <Label>Custom Class</Label>
                  <Input 
                    placeholder="Enter custom class names"
                    onChange={(e) => onUpdateAttributes({ className: e.target.value })}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
