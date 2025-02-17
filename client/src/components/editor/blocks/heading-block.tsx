import { TextEditor } from '../text-editor';
import { BaseBlock, BaseBlockProps } from './base-block';

interface HeadingBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function HeadingBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: HeadingBlockProps) {
  const handleContentChange = (newContent: string) => {
    // Ensure content is wrapped in a heading tag if it isn't already
    if (!newContent.match(/<h[1-6]>/)) {
      newContent = `<h1>${newContent}</h1>`;
    }
    onContentChange(newContent);
  };

  return (
    <BaseBlock {...baseProps}>
      <TextEditor
        initialContent={content}
        onContentChange={handleContentChange}
      />
    </BaseBlock>
  );
}
