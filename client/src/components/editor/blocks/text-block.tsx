import { TextEditor } from '../text-editor';
import { BaseBlock, BaseBlockProps } from './base-block';

interface TextBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function TextBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: TextBlockProps) {
  return (
    <BaseBlock {...baseProps}>
      <TextEditor
        initialContent={content}
        onContentChange={onContentChange}
      />
    </BaseBlock>
  );
}
