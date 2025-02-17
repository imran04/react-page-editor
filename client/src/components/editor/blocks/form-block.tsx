import { useState } from 'react';
import { BaseBlock, BaseBlockProps } from './base-block';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { FormBuilder } from '../form-builder';

interface FormConfig {
  fields: Array<{
    type: string;
    label: string;
    name: string;
    placeholder?: string;
    options?: Array<{
      label: string;
      value: string;
    }>;
    validation?: Array<{
      type: string;
      value?: string | number;
      message?: string;
    }>;
  }>;
}

interface FormBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
  attributes: Record<string, any>;
  onAttributesChange: (attributes: Record<string, any>) => void;
}

export function FormBlock({ 
  content, 
  onContentChange,
  attributes,
  onAttributesChange,
  ...baseProps
}: FormBlockProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const handleSave = (data: { html: string; schema: any; config: FormConfig }) => {
    // Store the HTML in content
    onContentChange(data.html);

    // Store the form configuration in attributes
    onAttributesChange({
      ...attributes,
      formSchema: data.schema,
      formConfig: data.config
    });
  };

  const parseInitialData = () => {
    try {
      if (attributes?.formConfig?.fields) {
        return attributes.formConfig.fields;
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