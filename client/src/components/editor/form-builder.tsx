import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactFormBuilder from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

interface FormBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: any) => void;
  initialData?: any;
}

// @ts-ignore - react-form-builder2 doesn't have proper TypeScript definitions
interface FormBuilderRef {
  saveForm: () => void;
}

export function FormBuilder({ 
  open, 
  onOpenChange, 
  onSave,
  initialData 
}: FormBuilderProps) {
  const [formData, setFormData] = useState(initialData);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Form Builder</span>
            <Button onClick={handleSave}>Save Form</Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-white">
          {/* @ts-ignore - react-form-builder2 doesn't have proper TypeScript definitions */}
          <ReactFormBuilder
            data={formData}
            onChange={(data: any) => setFormData(data)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}