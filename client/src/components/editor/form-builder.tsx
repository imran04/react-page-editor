import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveVertical, Code } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: string | number;
  message?: string;
}

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email';
  label: string;
  name: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: ValidationRule[];
}

interface FormBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: { html: string; schema: any; config: any }) => void;
  initialData?: FormField[];
}

export function FormBuilder({ 
  open, 
  onOpenChange, 
  onSave,
  initialData = []
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialData);
  const [showJson, setShowJson] = useState(false);
  const [parent] = useAutoAnimate();

  const addField = () => {
    const fieldCount = fields.length + 1;
    setFields([...fields, {
      id: crypto.randomUUID(),
      type: 'text',
      label: `Field ${fieldCount}`,
      name: `field_${fieldCount}`,
      placeholder: '',
      validation: []
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

  const addValidation = (fieldId: string, rule: ValidationRule) => {
    setFields(fields.map(field => 
      field.id === fieldId 
        ? { ...field, validation: [...(field.validation || []), rule] }
        : field
    ));
  };

  const removeValidation = (fieldId: string, ruleType: string) => {
    setFields(fields.map(field => 
      field.id === fieldId 
        ? { ...field, validation: field.validation?.filter(rule => rule.type !== ruleType) || [] }
        : field
    ));
  };

  const generateZodSchema = () => {
    const schemaFields: Record<string, any> = {};

    fields.forEach(field => {
      let schema = z.string();

      field.validation?.forEach(rule => {
        switch (rule.type) {
          case 'required':
            schema = schema.min(1, { message: rule.message || 'This field is required' });
            break;
          case 'email':
            schema = schema.email({ message: rule.message || 'Invalid email address' });
            break;
          case 'min':
            schema = schema.min(Number(rule.value), { message: rule.message || `Minimum length is ${rule.value}` });
            break;
          case 'max':
            schema = schema.max(Number(rule.value), { message: rule.message || `Maximum length is ${rule.value}` });
            break;
          case 'pattern':
            if (rule.value) {
              schema = schema.regex(new RegExp(rule.value), { message: rule.message || 'Invalid format' });
            }
            break;
        }
      });

      schemaFields[field.name] = schema;
    });

    return z.object(schemaFields);
  };

  const handleSave = () => {
    const formConfig = {
      fields: fields.map(({ id, ...field }) => field)
    };

    const schema = generateZodSchema();
    const formHtml = generateFormHtml(fields);

    onSave({ 
      html: formHtml, 
      schema: schema,
      config: formConfig
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Form Builder</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJson(!showJson)}
                className="gap-2"
              >
                <Code className="h-4 w-4" />
                {showJson ? 'Hide' : 'Show'} JSON
              </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div ref={parent} className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MoveVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Field Name</Label>
                          <Input
                            value={field.name}
                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                            placeholder="Field name for form data"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            placeholder="Placeholder text"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Validation</Label>
                        <div className="space-x-2">
                          <Checkbox 
                            checked={field.validation?.some(rule => rule.type === 'required')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addValidation(field.id, { type: 'required' });
                              } else {
                                removeValidation(field.id, 'required');
                              }
                            }}
                          />
                          <Label>Required</Label>
                        </div>
                        {field.type === 'email' && (
                          <div className="space-x-2">
                            <Checkbox 
                              checked={field.validation?.some(rule => rule.type === 'email')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addValidation(field.id, { type: 'email' });
                                } else {
                                  removeValidation(field.id, 'email');
                                }
                              }}
                            />
                            <Label>Email Format</Label>
                          </div>
                        )}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No fields added yet. Click "Add Field" to start building your form.
                </div>
              )}
            </div>

            {showJson && (
              <div className="space-y-4">
                <Card className="p-4">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify({ fields }, null, 2)}
                  </pre>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Generated Schema</h3>
                  <pre className="text-xs whitespace-pre-wrap">
                    {fields.length > 0 ? JSON.stringify(generateZodSchema(), null, 2) : 'No fields added'}
                  </pre>
                </Card>
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
        const validationAttrs = field.validation?.reduce((acc, rule) => {
          switch (rule.type) {
            case 'required':
              return { ...acc, required: true };
            case 'pattern':
              return { ...acc, pattern: rule.value };
            case 'min':
              return { ...acc, minlength: rule.value };
            case 'max':
              return { ...acc, maxlength: rule.value };
            default:
              return acc;
          }
        }, {});

        const attrs = Object.entries(validationAttrs || {})
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');

        switch (field.type) {
          case 'text':
          case 'email':
          case 'number':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <input 
                  type="${field.type}"
                  name="${field.name}"
                  placeholder="${field.placeholder || ''}"
                  class="${commonClasses}"
                  ${attrs}
                />
              </div>
            `;
          case 'textarea':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <textarea
                  name="${field.name}"
                  placeholder="${field.placeholder || ''}"
                  class="${commonClasses}"
                  ${attrs}
                ></textarea>
              </div>
            `;
          case 'select':
            return `
              <div class="space-y-2">
                <label class="block text-sm font-medium">${field.label}</label>
                <select name="${field.name}" class="${commonClasses}" ${attrs}>
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