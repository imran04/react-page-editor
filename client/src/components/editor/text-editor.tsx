import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from 'lucide-react';

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

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  return (
    <Card className="p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2 p-1 border rounded-md bg-muted/50">
        <Toggle
          size="sm"
          onClick={() => execCommand('bold')}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => execCommand('italic')}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => execCommand('underline')}
          aria-label="Toggle underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          aria-label="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          aria-label="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => execCommand('justifyRight')}
          aria-label="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Editor */}
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentChange}
        className="min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-2"
      />
    </Card>
  );
}