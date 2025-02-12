import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

export function TextEditor({ initialContent, onContentChange }: TextEditorProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <Card className="p-4">
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentChange}
        className="min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-2"
      />
    </Card>
  );
}
