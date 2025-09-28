import React from 'react';
import { ExportButton } from '@/components/common/export-button';
import { ExportData } from '@/utils/export-helpers';

interface DataTableProps {
  data: ExportData[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: ExportData) => React.ReactNode;
  }>;
  title?: string;
  filename?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  columns, 
  title = "Data Table",
  filename = "data-export"
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ExportButton 
          data={data} 
          filename={filename}
        />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
