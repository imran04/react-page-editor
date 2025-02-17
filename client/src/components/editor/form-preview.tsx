import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './form-builder';

interface FormPreviewProps {
  fields: FormField[];
  schema: z.ZodObject<any>;
}

export function FormPreview({ fields, schema }: FormPreviewProps) {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const { register, formState: { errors }, trigger } = form;

  // Real-time validation
  const handleFieldChange = async (name: string) => {
    await trigger(name);
  };

  return (
    <Card className="p-4">
      <form className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                {...register(field.name)}
                placeholder={field.placeholder}
                className={cn(
                  errors[field.name] && 'border-destructive'
                )}
                onChange={() => handleFieldChange(field.name)}
              />
            ) : field.type === 'select' ? (
              <Select 
                onValueChange={(value) => {
                  form.setValue(field.name, value);
                  handleFieldChange(field.name);
                }}
              >
                <SelectTrigger className={cn(
                  errors[field.name] && 'border-destructive'
                )}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
                className={cn(
                  errors[field.name] && 'border-destructive'
                )}
                onChange={() => handleFieldChange(field.name)}
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-destructive">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </form>
    </Card>
  );
}
