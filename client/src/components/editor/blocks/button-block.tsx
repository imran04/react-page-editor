import { Button } from '@/components/ui/button';
import { BaseBlock, BaseBlockProps } from './base-block';
import { TextEditor } from '../text-editor';

interface ButtonBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function ButtonBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: ButtonBlockProps) {
  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-2">
        <TextEditor
          initialContent={content}
          onContentChange={onContentChange}
        />
        <Button variant="outline" className="pointer-events-none">
          {content.replace(/<[^>]*>/g, '')}
        </Button>
      </div>
    </BaseBlock>
  );
}
