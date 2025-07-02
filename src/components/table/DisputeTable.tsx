import React from "react";

export interface DisputeTableColumn<T = any> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DisputeTableProps<T = any> {
  columns: DisputeTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const DisputeTable = <T,>({ columns, data, isLoading, emptyMessage = "No disputes found" }: DisputeTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#149A9B]"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm border-b border-gray-200 bg-[#F9FAFB]">
              {columns.map((col) => (
                <th key={col.key} className={`py-4 px-6 font-medium text-gray-700 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 px-6 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`py-4 px-6 ${col.className || ""}`}>
                      {col.render ? col.render(row) : String((row as any)[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputeTable; 