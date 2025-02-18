import { useState, useCallback } from 'react';
import { Modal, Button, Form, Card, Nav, Tab } from 'react-bootstrap';
import { Plus, Trash2, MoveVertical, Code, Eye, Grid2X2 } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { z } from 'zod';
import { FormPreview } from './form-preview';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: string | number;
  message?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'time' | 'checkbox' | 'radio' | 'url' | 'color' | 'file';
  label: string;
  name: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: ValidationRule[];
  gridPosition?: {
    row: number;
    column: number;
    width: number;
  };
}

interface FormBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: { html: string; schema: any; config: any }) => void;
  initialData?: FormField[];
}

export function FormBuilder({
  open,
  onOpenChange,
  onSave,
  initialData = []
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialData.map(field => ({
    ...field,
    gridPosition: field.gridPosition || { row: 0, column: 0, width: 12 }
  })));
  const [showJson, setShowJson] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [parent] = useAutoAnimate();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);

      const newFields = [...fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);

      setFields(newFields);
    }

    setActiveId(null);
  };

  const addField = () => {
    const fieldCount = fields.length + 1;
    setFields([...fields, {
      id: crypto.randomUUID(),
      type: 'text',
      label: `Field ${fieldCount}`,
      name: `field_${fieldCount}`,
      placeholder: '',
      validation: [],
      gridPosition: { row: 0, column: 0, width: 12 }
    }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addValidation = (fieldId: string, rule: ValidationRule) => {
    setFields(fields.map(field =>
      field.id === fieldId
        ? { ...field, validation: [...(field.validation || []), rule] }
        : field
    ));
  };

  const removeValidation = (fieldId: string, ruleType: string) => {
    setFields(fields.map(field =>
      field.id === fieldId
        ? { ...field, validation: field.validation?.filter(rule => rule.type !== ruleType) || [] }
        : field
    ));
  };

  const generateZodSchema = () => {
    const schemaFields: Record<string, any> = {};

    fields.forEach(field => {
      let schema = z.string();

      field.validation?.forEach(rule => {
        switch (rule.type) {
          case 'required':
            schema = schema.min(1, { message: rule.message || 'This field is required' });
            break;
          case 'email':
            schema = schema.email({ message: rule.message || 'Invalid email address' });
            break;
          case 'min':
            schema = schema.min(Number(rule.value), { message: rule.message || `Minimum length is ${rule.value}` });
            break;
          case 'max':
            schema = schema.max(Number(rule.value), { message: rule.message || `Maximum length is ${rule.value}` });
            break;
          case 'pattern':
            if (rule.value) {
              schema = schema.regex(new RegExp(String(rule.value)), { message: rule.message || 'Invalid format' });
            }
            break;
        }
      });

      schemaFields[field.name] = schema;
    });

    return z.object(schemaFields);
  };

  const generateFormHtml = (fields: FormField[]): string => {
    return `
      <form class="space-y-4">
        ${fields.map(field => {
      const commonClasses = 'w-full p-2 border rounded-md';
      const validationAttrs = field.validation?.reduce((acc, rule) => {
        switch (rule.type) {
          case 'required':
            return { ...acc, required: true };
          case 'pattern':
            return { ...acc, pattern: rule.value };
          case 'min':
            return { ...acc, minlength: rule.value };
          case 'max':
            return { ...acc, maxlength: rule.value };
          default:
            return acc;
        }
      }, {});

      const attrs = Object.entries(validationAttrs || {})
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'password':
        case 'tel':
        case 'date':
        case 'time':
        case 'url':
        case 'color':
        case 'file':
          return `
                <div class="space-y-2">
                  <label class="block text-sm font-medium">${field.label}</label>
                  <input 
                    type="${field.type}"
                    name="${field.name}"
                    placeholder="${field.placeholder || ''}"
                    class="${commonClasses}"
                    ${attrs}
                  />
                </div>
              `;
        case 'textarea':
          return `
                <div class="space-y-2">
                  <label class="block text-sm font-medium">${field.label}</label>
                  <textarea
                    name="${field.name}"
                    placeholder="${field.placeholder || ''}"
                    class="${commonClasses}"
                    ${attrs}
                  ></textarea>
                </div>
              `;
        case 'select':
          return `
                <div class="space-y-2">
                  <label class="block text-sm font-medium">${field.label}</label>
                  <select name="${field.name}" class="${commonClasses}" ${attrs}>
                    <option value="">${field.placeholder || 'Select an option'}</option>
                    ${field.options?.map(opt =>
                      `<option value="${opt.value}">${opt.label}</option>`
                    ).join('')}
                  </select>
                </div>
              `;
        case 'checkbox':
          return `
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      name="${field.name}"
                      class="h-4 w-4 rounded border-gray-300"
                      ${attrs}
                    />
                    <span class="text-sm font-medium">${field.label}</span>
                  </label>
                </div>
              `;
        case 'radio':
          return `
                <div class="space-y-2">
                  <label class="block text-sm font-medium">${field.label}</label>
                  <div class="space-y-1">
                    ${field.options?.map(opt => `
                      <label class="flex items-center gap-2">
                        <input 
                          type="radio"
                          name="${field.name}"
                          value="${opt.value}"
                          class="h-4 w-4 border-gray-300"
                          ${attrs}
                        />
                        <span class="text-sm">${opt.label}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>
              `;
        default:
          return '';
      }
    }).join('')}
        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          ${submitButtonText}
        </button>
      </form>
    `;
  };

  const handleSave = () => {
    const formConfig = {
      fields: fields.map(({ id, ...field }) => field),
      submitButtonText
    };

    const schema = generateZodSchema();
    const formHtml = generateFormHtml(fields);

    onSave({
      html: formHtml,
      schema: schema,
      config: formConfig
    });
    onOpenChange(false);
  };

  const handleFieldMove = useCallback((updatedField: FormField) => {
    setFields(prev => prev.map(field =>
      field.id === updatedField.id ? updatedField : field
    ));
  }, []);

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} size="xl">
      <Modal.Header>
        <Modal.Title className="d-flex justify-content-between align-items-center w-100">
          <span>Form Builder</span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setLayoutMode(mode => mode === 'list' ? 'grid' : 'list')}
              className="d-flex align-items-center gap-2"
            >
              <Grid2X2 className="h-4 w-4" />
              {layoutMode === 'list' ? 'Grid Layout' : 'List Layout'}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowJson(!showJson)}
              className="d-flex align-items-center gap-2"
            >
              <Code className="h-4 w-4" />
              {showJson ? 'Hide' : 'Show'} JSON
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setPreviewTab(previewTab === 'edit' ? 'preview' : 'edit')}
              className="d-flex align-items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewTab === 'edit' ? 'Show Preview' : 'Hide Preview'}
            </Button>
            <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>Save Form</Button>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4">
        <Tab.Container activeKey={previewTab} onSelect={(k) => setPreviewTab(k as 'edit' | 'preview')}>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="edit">Edit Form</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="preview">Live Preview</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="edit">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-column gap-2">
                    <Form.Label>Submit Button Text</Form.Label>
                    <Form.Control
                      value={submitButtonText}
                      onChange={(e) => setSubmitButtonText(e.target.value)}
                      placeholder="Submit button text"
                    />
                  </div>
                  <Button onClick={addField} className="d-flex align-items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                <div className="row">
                  <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div ref={parent} className={showJson ? 'col-lg-6' : 'col-12'}>
                      <Card className="p-4">
                        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                          {fields.map((field) => (
                            <SortableFieldCard
                              key={field.id}
                              field={field}
                              onUpdate={(updates) => updateField(field.id, updates)}
                              onRemove={() => removeField(field.id)}
                              onAddValidation={(rule) => addValidation(field.id, rule)}
                              onRemoveValidation={(type) => removeValidation(field.id, type)}
                              onFieldMove={handleFieldMove}
                            />
                          ))}
                        </SortableContext>
                      </Card>
                    </div>
                    {showJson && (
                      <div className="col-lg-6">
                        <Card className="p-4">
                          <pre className="small">
                            {JSON.stringify({ fields, submitButtonText }, null, 2)}
                          </pre>
                        </Card>
                        <Card className="mt-4 p-4">
                          <h3 className="fw-semibold mb-2">Generated Schema</h3>
                          <pre className="small">
                            {fields.length > 0 ? JSON.stringify(generateZodSchema(), null, 2) : 'No fields added'}
                          </pre>
                        </Card>
                      </div>
                    )}
                  </DndContext>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="preview">
              <Card className="p-4">
                <h3 className="fs-4 fw-semibold mb-4">Form Preview with Live Validation</h3>
                <FormPreview
                  fields={fields}
                  schema={generateZodSchema()}
                  layoutMode={layoutMode}
                  onFieldMove={handleFieldMove}
                />
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}

function SortableFieldCard({
  field,
  onUpdate,
  onRemove,
  onAddValidation,
  onRemoveValidation,
  onFieldMove,
}: {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onAddValidation: (rule: ValidationRule) => void;
  onRemoveValidation: (type: string) => void;
  onFieldMove: (updatedField: FormField) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
      <Card className="p-4 mb-3">
        <div className="d-flex align-items-center gap-2 mb-4">
          <MoveVertical className="h-4 w-4 text-muted cursor-move" />
          <div className="flex-1">
            <div className="row g-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Field Type</Form.Label>
                  <Form.Select
                    value={field.type}
                    onChange={(e) => onUpdate({ type: e.target.value as any })}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Select</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="tel">Telephone</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="url">URL</option>
                    <option value="color">Color</option>
                    <option value="file">File Upload</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    value={field.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    placeholder="Field Label"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Field Name</Form.Label>
                  <Form.Control
                    value={field.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    placeholder="Field name for form data"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Placeholder</Form.Label>
                  <Form.Control
                    value={field.placeholder}
                    onChange={(e) => onUpdate({ placeholder: e.target.value })}
                    placeholder="Placeholder text"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="mt-3">
              <Form.Label>Validation</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="checkbox"
                  label="Required"
                  checked={field.validation?.some(rule => rule.type === 'required')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAddValidation({ type: 'required' });
                    } else {
                      onRemoveValidation('required');
                    }
                  }}
                />
                {field.type === 'email' && (
                  <Form.Check
                    type="checkbox"
                    label="Email Format"
                    checked={field.validation?.some(rule => rule.type === 'email')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddValidation({ type: 'email' });
                      } else {
                        onRemoveValidation('email');
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {(field.type === 'select' || field.type === 'radio') && (
              <div className="mt-3">
                <Form.Group>
                  <Form.Label>Options (one per line)</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={field.options?.map(opt => `${opt.label}=${opt.value}`).join('\n') || ''}
                    onChange={(e) => {
                      const options = e.target.value.split('\n').map(line => {
                        const [label, value] = line.split('=');
                        return { label: label || '', value: value || label || '' };
                      });
                      onUpdate({ options });
                    }}
                    placeholder="Option Label=value"
                  />
                </Form.Group>
              </div>
            )}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={onRemove}
            className="p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}