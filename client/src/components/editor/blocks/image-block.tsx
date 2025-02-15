import { BaseBlock, BaseBlockProps } from './base-block';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

interface ImageBlockProps extends Omit<BaseBlockProps, 'children'> {
  content: string;
  onContentChange: (content: string) => void;
}

export function ImageBlock({ 
  content, 
  onContentChange,
  ...baseProps
}: ImageBlockProps) {
  return (
    <BaseBlock {...baseProps}>
      {content ? (
        <div className="relative group">
          <img 
            src={content} 
            alt="Uploaded content" 
            className="max-w-full h-auto rounded-lg"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onContentChange('')}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            type="url"
            placeholder="Enter image URL"
            onChange={(e) => onContentChange(e.target.value)}
          />
          <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <div className="text-center space-y-2">
              <Image className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Enter an image URL above
              </p>
            </div>
          </div>
        </div>
      )}
    </BaseBlock>
  );
}
