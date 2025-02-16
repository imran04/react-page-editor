import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HtmlPreviewProps {
  data: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HtmlPreview({ data, open, onOpenChange }: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePreview = async () => {
    if (!iframeRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // Make the API call with the correct request structure
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: JSON.stringify(data)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${response.statusText}`);
      }

      const html = await response.text();

      // Update the iframe content
      if (iframeRef.current) {
        iframeRef.current.srcdoc = html;
      }
    } catch (err) {
      console.error('Error fetching preview:', err);
      setError(err instanceof Error ? err.message : 'Error generating preview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Page Preview</span>
            <Button 
              onClick={generatePreview}
              disabled={loading}
              className="gap-2"
            >
              {loading ? 'Generating...' : 'Generate Preview'}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Click Generate Preview to see how your page will look
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 bg-white rounded-lg overflow-hidden h-full">
          {error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Page Preview"
              sandbox="allow-same-origin allow-scripts"
              allow="encrypted-media"
              srcDoc=""
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}