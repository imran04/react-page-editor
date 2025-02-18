import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Form } from 'react-bootstrap';
import { FormField } from './form-builder';
import { FormGridLayout } from './form-grid-layout';
import { z } from 'zod';

interface FormPreviewProps {
  fields: FormField[];
  schema: z.ZodObject<any>;
  layoutMode: 'list' | 'grid';
  onFieldMove?: (field: FormField) => void;
}

export function FormPreview({ fields, schema, layoutMode, onFieldMove }: FormPreviewProps) {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const { register, formState: { errors }, trigger, setValue } = form;

  const handleFieldMove = useCallback((id: string, position: { row: number; column: number; width: number }) => {
    if (onFieldMove) {
      const field = fields.find(f => f.id === id);
      if (field) {
        onFieldMove({
          ...field,
          gridPosition: position
        });
      }
    }
  }, [fields, onFieldMove]);

  const handleFieldChange = async (name: string) => {
    await trigger(name);
  };

  if (layoutMode === 'grid') {
    return (
      <FormGridLayout
        fields={fields}
        onFieldMove={handleFieldMove}
      />
    );
  }

  return (
    <Card className="p-4">
      <Form className="d-flex flex-column gap-4">
        {fields.map(field => (
          <div key={field.id}>
            <Form.Group>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'textarea' ? (
                <Form.Control
                  as="textarea"
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className={errors[field.name] ? 'border-danger' : ''}
                  onChange={() => handleFieldChange(field.name)}
                />
              ) : field.type === 'select' ? (
                <Form.Select
                  {...register(field.name)}
                  onChange={(e) => {
                    setValue(field.name, e.target.value);
                    handleFieldChange(field.name);
                  }}
                  className={errors[field.name] ? 'border-danger' : ''}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              ) : field.type === 'checkbox' ? (
                <Form.Check
                  type="checkbox"
                  label={field.placeholder}
                  {...register(field.name)}
                  onChange={(e) => {
                    setValue(field.name, e.target.checked);
                    handleFieldChange(field.name);
                  }}
                />
              ) : field.type === 'radio' ? (
                <div>
                  {field.options?.map(opt => (
                    <Form.Check
                      key={opt.value}
                      type="radio"
                      label={opt.label}
                      value={opt.value}
                      {...register(field.name)}
                      onChange={() => handleFieldChange(field.name)}
                    />
                  ))}
                </div>
              ) : (
                <Form.Control
                  type={field.type}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className={errors[field.name] ? 'border-danger' : ''}
                  onChange={() => handleFieldChange(field.name)}
                />
              )}
              {errors[field.name] && (
                <Form.Text className="text-danger">
                  {errors[field.name]?.message as string}
                </Form.Text>
              )}
            </Form.Group>
          </div>
        ))}
      </Form>
    </Card>
  );
}