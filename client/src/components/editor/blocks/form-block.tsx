import { useState } from 'react';
import { BaseBlock, BaseBlockProps } from './base-block';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { FormBuilder } from '../form-builder';

interface FormBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function FormBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: FormBlockProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const handleFormSave = (formData: any) => {
    // Convert form builder data to HTML
    const formHtml = `
      <form>
        ${formData.map((item: any) => {
          switch (item.element) {
            case 'TextInput':
              return `
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-1">${item.label}</label>
                  <input type="text" placeholder="${item.placeholder || ''}" class="w-full p-2 border rounded" />
                </div>
              `;
            case 'TextArea':
              return `
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-1">${item.label}</label>
                  <textarea placeholder="${item.placeholder || ''}" class="w-full p-2 border rounded"></textarea>
                </div>
              `;
            case 'Dropdown':
              return `
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-1">${item.label}</label>
                  <select class="w-full p-2 border rounded">
                    ${item.options?.map((opt: any) => 
                      `<option value="${opt.value}">${opt.label}</option>`
                    ).join('')}
                  </select>
                </div>
              `;
            // Add more cases for other form elements
            default:
              return '';
          }
        }).join('')}
        <button type="submit" class="px-4 py-2 bg-primary text-white rounded">Submit</button>
      </form>
    `;

    onContentChange(formHtml);
  };

  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBuilderOpen(true)}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Edit Form
          </Button>
        </div>
        <div 
          className="p-4 bg-muted/50 rounded-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <FormBuilder
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={handleFormSave}
        initialData={[]} // TODO: Parse existing HTML back to form data
      />
    </BaseBlock>
  );
}