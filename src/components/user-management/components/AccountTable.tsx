import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { User } from "@/interfaces/user.interface";
import { CircleCheck, Copy } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  users: User[];
  onViewProfile: (id: number) => void;
}

export function AccountTable({ users, onViewProfile }: UserTableProps) {
  return (
    <Table>
      <TableHeader className="bg-[#F9FAFB] rounded-t-2xl">
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Email address</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Date joined</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="text-blue-500">Validated</span>
                <CircleCheck className="ml-1 h-4 w-4 text-white fill-[#52C41A]" />
              </div>
            </TableCell>
            <TableCell>{user.location}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className="text-blue-500">{user.id}</span>
                <Copy className="ml-1 h-4 w-4 text-gray-400" />
              </div>
            </TableCell>
            <TableCell>{user.submissionDate}</TableCell>
            <TableCell>
              <Button
                className="text-blue-500 shadow-none p-0"
                onClick={() => onViewProfile(user.id)}
              >
                View profile
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
