import { BaseBlock, BaseBlockProps } from './base-block';
import { TextEditor } from '../text-editor';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FormBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function FormBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: FormBlockProps) {
  const defaultForm = `
    <form>
      <div class="space-y-4">
        <div>
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  `;

  const handleContentChange = (newContent: string) => {
    // Ensure content is wrapped in a form tag if it isn't already
    if (!newContent.match(/<form[^>]*>/)) {
      newContent = defaultForm;
    }
    onContentChange(newContent);
  };

  return (
    <BaseBlock {...baseProps}>
      <div className="space-y-4">
        <TextEditor
          initialContent={content || defaultForm}
          onContentChange={handleContentChange}
        />
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter your name" disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email" disabled />
            </div>
            <Button disabled>Submit</Button>
          </div>
        </Card>
      </div>
    </BaseBlock>
  );
}
