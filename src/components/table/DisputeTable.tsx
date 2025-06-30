import React from "react";

export interface DisputeTableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
}

export interface DisputeTableProps {
  columns: DisputeTableColumn[];
  data: any[];
}

const DisputeTable: React.FC<DisputeTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="text-left  text-sm   border-b border-gray-200 bg-[#F9FAFB] ">
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-4 py-4 font-medium ${col.className || ""}`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-base">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td key={col.key} className={`py-3 text-sm px-4 whitespace-nowrap ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisputeTable; 