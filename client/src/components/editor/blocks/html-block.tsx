import { BaseBlock, BaseBlockProps } from './base-block';
import { TextEditor } from '../text-editor';

interface HtmlBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function HtmlBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: HtmlBlockProps) {
  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-2">
        <TextEditor
          initialContent={content}
          onContentChange={onContentChange}
        />
        <div 
          className="p-2 bg-muted rounded-md"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </BaseBlock>
  );
}
