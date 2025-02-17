import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Code } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    backgroundColor: 'rgb(var(--muted))',
    fontWeight: '500',
    textAlign: 'left',
  },
  cell: {
    padding: '0.5rem',
    border: '1px solid rgb(var(--border))',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Table Builder</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJson(!showJson)}
                className="gap-2"
              >
                <Code className="h-4 w-4" />
                {showJson ? 'Hide' : 'Show'} JSON
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Table</Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-end gap-2 mb-4">
            <Button onClick={addRow} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
            <Button onClick={addColumn} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Column
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div ref={parent} className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-8"></th>
                      {tableData.headers.map((header, index) => (
                        <th key={header.id} className="p-2">
                          <div className="space-y-2">
                            <Input
                              value={header.content}
                              onChange={(e) => updateHeader(header.id, { content: e.target.value })}
                              className="min-w-[100px]"
                            />
                            <Select
                              value={header.align || 'left'}
                              onValueChange={(value) => updateHeader(header.id, { align: value as 'left' | 'center' | 'right' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
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
                        <td className="w-8">
                          <div className="flex items-center">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        {row.cells.map((cell) => (
                          <td key={cell.id} className="p-2">
                            <div className="space-y-2">
                              <Input
                                value={cell.content}
                                onChange={(e) => updateCell(row.id, cell.id, { content: e.target.value })}
                                className="min-w-[100px]"
                              />
                              <Select
                                value={cell.type || 'text'}
                                onValueChange={(value) => updateCell(row.id, cell.id, { type: value as 'text' | 'number' | 'date' })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {showJson && (
              <Card className="p-4">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(tableData, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    <table style="${styleToString(tableStyles)}">
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