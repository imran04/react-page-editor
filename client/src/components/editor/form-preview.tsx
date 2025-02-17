import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { FormField } from './form-builder';

interface FormPreviewProps {
  fields: FormField[];
  schema: z.ZodObject<any>;
}

export function FormPreview({ fields, schema }: FormPreviewProps) {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const { register, formState: { errors }, trigger, setValue } = form;

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
                  setValue(field.name, value);
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
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...register(field.name)}
                  onCheckedChange={(checked) => {
                    setValue(field.name, checked);
                    handleFieldChange(field.name);
                  }}
                />
                <Label>{field.placeholder}</Label>
              </div>
            ) : field.type === 'radio' ? (
              <RadioGroup
                onValueChange={(value) => {
                  setValue(field.name, value);
                  handleFieldChange(field.name);
                }}
              >
                <div className="space-y-2">
                  {field.options?.map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                      <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
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