import { useState } from 'react';
import { BaseBlock, BaseBlockProps } from './base-block';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { FormBuilder } from '../form-builder';

interface FormData {
  html: string;
  schema: any;
  config: any;
}

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
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSave = (data: FormData) => {
    setFormData(data);
    onContentChange(data.html);
  };

  const parseInitialData = () => {
    try {
      if (formData) {
        return formData.config.fields;
      }
      return [];
    } catch {
      return [];
    }
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
          dangerouslySetInnerHTML={{ 
            __html: content || '<div class="text-muted-foreground text-center py-4">Click "Edit Form" to configure the form</div>' 
          }}
        />
      </div>
      <FormBuilder
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSave={handleSave}
        initialData={parseInitialData()}
      />
    </BaseBlock>
  );
}