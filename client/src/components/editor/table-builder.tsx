import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface TableCell {
  id: string;
  content: string;
}

interface TableRow {
  id: string;
  cells: TableCell[];
}

interface TableData {
  headers: TableCell[];
  rows: TableRow[];
}

interface TableBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tableHtml: string) => void;
  initialData?: TableData;
}

export function TableBuilder({ 
  open, 
  onOpenChange, 
  onSave,
  initialData 
}: TableBuilderProps) {
  const [tableData, setTableData] = useState<TableData>(initialData || {
    headers: [{ id: crypto.randomUUID(), content: 'Header 1' }],
    rows: [
      {
        id: crypto.randomUUID(),
        cells: [{ id: crypto.randomUUID(), content: 'Cell 1' }]
      }
    ]
  });

  const [parent] = useAutoAnimate();

  const addColumn = () => {
    setTableData(prev => ({
      headers: [...prev.headers, { id: crypto.randomUUID(), content: `Header ${prev.headers.length + 1}` }],
      rows: prev.rows.map(row => ({
        ...row,
        cells: [...row.cells, { id: crypto.randomUUID(), content: 'New Cell' }]
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

  const updateHeader = (id: string, content: string) => {
    setTableData(prev => ({
      ...prev,
      headers: prev.headers.map(header =>
        header.id === id ? { ...header, content } : header
      )
    }));
  };

  const updateCell = (rowId: string, cellId: string, content: string) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map(cell =>
                cell.id === cellId ? { ...cell, content } : cell
              )
            }
          : row
      )
    }));
  };

  const handleSave = () => {
    const tableHtml = generateTableHtml(tableData);
    onSave(tableHtml);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Table Builder</span>
            <div className="flex gap-2">
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

          <Card className="p-4">
            <div ref={parent} className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-8"></th>
                    {tableData.headers.map((header, index) => (
                      <th key={header.id} className="p-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={header.content}
                            onChange={(e) => updateHeader(header.id, e.target.value)}
                            className="min-w-[100px]"
                          />
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
                          <Input
                            value={cell.content}
                            onChange={(e) => updateCell(row.id, cell.id, e.target.value)}
                            className="min-w-[100px]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateTableHtml(tableData: TableData): string {
  return `
    <table class="w-full border-collapse border">
      <thead>
        <tr>
          ${tableData.headers.map(header => 
            `<th class="border p-2 bg-muted font-medium">${header.content}</th>`
          ).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableData.rows.map(row => `
          <tr>
            ${row.cells.map(cell => 
              `<td class="border p-2">${cell.content}</td>`
            ).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
