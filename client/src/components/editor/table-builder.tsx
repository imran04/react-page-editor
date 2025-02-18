import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Plus, Trash2, GripVertical, Code } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface TableCell {
  id: string;
  content: string;
  type?: 'text' | 'number' | 'date';
  align?: 'left' | 'center' | 'right';
  styles?: Record<string, string>;
}

interface TableRow {
  id: string;
  cells: TableCell[];
}

interface TableConfig {
  headers: TableCell[];
  rows: TableRow[];
  styles?: {
    table?: Record<string, string>;
    header?: Record<string, string>;
    cell?: Record<string, string>;
  };
}

interface TableBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tableData: { html: string; config: TableConfig }) => void;
  initialData?: TableConfig;
}

const defaultStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  header: {
    backgroundColor: 'rgb(var(--bs-secondary-bg))',
    fontWeight: '500',
    textAlign: 'left',
  },
  cell: {
    padding: '0.5rem',
    border: '1px solid rgb(var(--bs-border-color))',
  },
};

export function TableBuilder({ 
  open, 
  onOpenChange, 
  onSave,
  initialData 
}: TableBuilderProps) {
  const [tableData, setTableData] = useState<TableConfig>(initialData || {
    headers: [{ id: crypto.randomUUID(), content: 'Header 1' }],
    rows: [
      {
        id: crypto.randomUUID(),
        cells: [{ id: crypto.randomUUID(), content: 'Cell 1' }]
      }
    ],
    styles: defaultStyles,
  });
  const [showJson, setShowJson] = useState(false);
  const [parent] = useAutoAnimate();

  const addColumn = () => {
    const newHeaderId = crypto.randomUUID();
    setTableData(prev => ({
      ...prev,
      headers: [...prev.headers, { 
        id: newHeaderId, 
        content: `Header ${prev.headers.length + 1}` 
      }],
      rows: prev.rows.map(row => ({
        ...row,
        cells: [...row.cells, { 
          id: crypto.randomUUID(), 
          content: 'New Cell' 
        }]
      }))
    }));
  };

  const addRow = () => {
    setTableData(prev => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          id: crypto.randomUUID(),
          cells: prev.headers.map(() => ({ 
            id: crypto.randomUUID(), 
            content: 'New Cell' 
          }))
        }
      ]
    }));
  };

  const removeColumn = (index: number) => {
    setTableData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
      rows: prev.rows.map(row => ({
        ...row,
        cells: row.cells.filter((_, i) => i !== index)
      }))
    }));
  };

  const removeRow = (rowId: string) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== rowId)
    }));
  };

  const updateHeader = (id: string, updates: Partial<TableCell>) => {
    setTableData(prev => ({
      ...prev,
      headers: prev.headers.map(header =>
        header.id === id ? { ...header, ...updates } : header
      )
    }));
  };

  const updateCell = (rowId: string, cellId: string, updates: Partial<TableCell>) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map(cell =>
                cell.id === cellId ? { ...cell, ...updates } : cell
              )
            }
          : row
      )
    }));
  };

  const handleSave = () => {
    const tableHtml = generateTableHtml(tableData);
    onSave({ html: tableHtml, config: tableData });
    onOpenChange(false);
  };

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} size="xl">
      <Modal.Header>
        <Modal.Title className="d-flex justify-content-between align-items-center w-100">
          <span>Table Builder</span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowJson(!showJson)}
              className="d-flex align-items-center gap-2"
            >
              <Code className="h-4 w-4" />
              {showJson ? 'Hide' : 'Show'} JSON
            </Button>
            <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>Save Table</Button>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4">
        <div className="d-flex justify-content-end gap-2 mb-4">
          <Button onClick={addRow} className="d-flex align-items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Row
          </Button>
          <Button onClick={addColumn} className="d-flex align-items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
        </div>

        <div className="row">
          <div className={`${showJson ? 'col-lg-6' : 'col-12'}`}>
            <Card className="p-4">
              <div ref={parent} className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '2rem' }}></th>
                      {tableData.headers.map((header, index) => (
                        <th key={header.id} className="p-2">
                          <div className="d-flex flex-column gap-2">
                            <Form.Control
                              value={header.content}
                              onChange={(e) => updateHeader(header.id, { content: e.target.value })}
                              className="min-width-100"
                            />
                            <Form.Select
                              value={header.align || 'left'}
                              onChange={(e) => updateHeader(header.id, { align: e.target.value as 'left' | 'center' | 'right' })}
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </Form.Select>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removeColumn(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row) => (
                      <tr key={row.id}>
                        <td style={{ width: '2rem' }}>
                          <div className="d-flex align-items-center">
                            <GripVertical className="h-4 w-4 text-muted cursor-move" />
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removeRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        {row.cells.map((cell) => (
                          <td key={cell.id} className="p-2">
                            <div className="d-flex flex-column gap-2">
                              <Form.Control
                                value={cell.content}
                                onChange={(e) => updateCell(row.id, cell.id, { content: e.target.value })}
                                className="min-width-100"
                              />
                              <Form.Select
                                value={cell.type || 'text'}
                                onChange={(e) => updateCell(row.id, cell.id, { type: e.target.value as 'text' | 'number' | 'date' })}
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                              </Form.Select>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {showJson && (
            <div className="col-lg-6">
              <Card className="p-4">
                <pre className="small">
                  {JSON.stringify({ headers: tableData.headers, rows: tableData.rows }, null, 2)}
                </pre>
              </Card>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

function generateTableHtml(config: TableConfig): string {
  const tableStyles = {
    ...defaultStyles.table,
    ...(config.styles?.table || {})
  };

  const headerStyles = {
    ...defaultStyles.header,
    ...(config.styles?.header || {})
  };

  const cellStyles = {
    ...defaultStyles.cell,
    ...(config.styles?.cell || {})
  };

  const styleToString = (styles: Record<string, string>) => 
    Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

  return `
    <table class="table table-bordered" style="${styleToString(tableStyles)}">
      <thead>
        <tr>
          ${config.headers.map(header => `
            <th style="${styleToString({ ...headerStyles, textAlign: header.align || 'left' })}">
              ${header.content}
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        ${config.rows.map(row => `
          <tr>
            ${row.cells.map((cell, index) => {
              const align = config.headers[index]?.align || 'left';
              return `
                <td style="${styleToString({ ...cellStyles, textAlign: align })}">
                  ${cell.content}
                </td>
              `;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}