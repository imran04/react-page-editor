import { Button } from '@/components/ui/button';
import { BaseBlock, BaseBlockProps } from './base-block';
import { TextEditor } from '../text-editor';

interface LinkBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function LinkBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: LinkBlockProps) {
  const handleContentChange = (newContent: string) => {
    // Ensure content is wrapped in an anchor tag if it isn't already
    if (!newContent.match(/<a[^>]*>/)) {
      newContent = `<a href="#">${newContent}</a>`;
    }
    onContentChange(newContent);
  };

  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-2">
        <TextEditor
          initialContent={content}
          onContentChange={handleContentChange}
        />
        <Button 
          variant="link" 
          className="pointer-events-none"
        >
          {content.replace(/<[^>]*>/g, '')}
        </Button>
      </div>
    </BaseBlock>
  );
}
