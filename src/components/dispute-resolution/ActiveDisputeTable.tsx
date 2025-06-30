import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const mockDisputes = [
  {
    id: "1",
    project: "Website Redesign",
    user: "Jane Doe",
    opened: "2024-06-01",
    status: "Active",
  },
  {
    id: "2",
    project: "Mobile App",
    user: "John Smith",
    opened: "2024-06-03",
    status: "Active",
  },
];

export default function ActiveDisputeTable({ onView }: { onView: (id: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Opened</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockDisputes.map((dispute) => (
          <TableRow key={dispute.id}>
            <TableCell>{dispute.project}</TableCell>
            <TableCell>{dispute.user}</TableCell>
            <TableCell>{dispute.opened}</TableCell>
            <TableCell>{dispute.status}</TableCell>
            <TableCell>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onView(dispute.id)}
              >
                View dispute
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 