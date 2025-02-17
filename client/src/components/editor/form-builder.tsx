import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveVertical } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email';
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface FormBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: any) => void;
  initialData?: FormField[];
}

export function FormBuilder({ 
  open, 
  onOpenChange, 
  onSave,
  initialData = []
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialData);
  const [parent] = useAutoAnimate();

  const addField = () => {
    setFields([...fields, {
      id: crypto.randomUUID(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false
    }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleSave = () => {
    const formHtml = generateFormHtml(fields);
    onSave(formHtml);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Form Builder</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Form</Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-end mb-4">
            <Button onClick={addField} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          <div ref={parent} className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MoveVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div className="flex-1 grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value: any) => updateField(field.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Field Label"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Placeholder</Label>
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  {field.type === 'select' && (
                    <div className="space-y-2">
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={field.options?.map(opt => `${opt.label}=${opt.value}`).join('\n') || ''}
                        onChange={(e) => {
                          const options = e.target.value.split('\n').map(line => {
                            const [label, value] = line.split('=');
                            return { label: label || '', value: value || label || '' };
                          });
                          updateField(field.id, { options });
                        }}
                        placeholder="Option Label=value"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No fields added yet. Click "Add Field" to start building your form.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateFormHtml(fields: FormField[]): string {
  return `
    <form class="space-y-4">
      ${fields.map(field => {
        const commonClasses = 'w-full p-2 border rounded-md';
        switch (field.type) {
          case 'text':
          case 'email':
          case 'number':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <input 
                  type="${field.type}"
                  placeholder="${field.placeholder || ''}"
                  class="${commonClasses}"
                  ${field.required ? 'required' : ''}
                />
              </div>
            `;
          case 'textarea':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <textarea
                  placeholder="${field.placeholder || ''}"
                  class="${commonClasses}"
                  ${field.required ? 'required' : ''}
                ></textarea>
              </div>
            `;
          case 'select':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <select class="${commonClasses}" ${field.required ? 'required' : ''}>
                  <option value="">${field.placeholder || 'Select an option'}</option>
                  ${field.options?.map(opt => 
                    `<option value="${opt.value}">${opt.label}</option>`
                  ).join('')}
                </select>
              </div>
            `;
          default:
            return '';
        }
      }).join('')}
      <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
        Submit
      </button>
    </form>
  `;
}