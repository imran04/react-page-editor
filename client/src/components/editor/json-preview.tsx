import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface JsonPreviewProps {
  data: any;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-structure.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-muted p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">JSON Preview</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </Button>
      </div>
      <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}