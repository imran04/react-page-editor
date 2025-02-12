import { Card } from '@/components/ui/card';

interface JsonPreviewProps {
  data: any;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  return (
    <Card className="bg-muted p-4">
      <h3 className="text-lg font-semibold mb-2">JSON Preview</h3>
      <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}
