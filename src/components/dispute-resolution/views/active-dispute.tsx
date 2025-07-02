import React, { useState } from "react";
import DisputeTable, { DisputeTableColumn } from "@/components/table/DisputeTable";
import { FaRegCopy, FaChevronDown, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { DisputeRow } from "@/types";
import Link from "next/link";

const columns: DisputeTableColumn<DisputeRow>[] = [
  { key: "date", label: "Date" },
  { 
    key: "userId", 
    label: "User ID",
    render: (row) => (
      <span className="flex items-center gap-2 text-blue-600">
        <span className="underline cursor-pointer">{row.userId}</span>
        <FaRegCopy className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600" />
      </span>
    ),
  },
  { key: "name", label: "Customer Name" },
  {
    key: "email",
    label: "Email address",
    render: (row) =>
      row.email.length > 25 ? row.email.slice(0, 25) + "..." : row.email,
  },
  {
    key: "amount",
    label: "Amount",
    render: (row) => (
      <span className="font-medium">${row.amount}</span>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <Link
        href={`/dispute-resolution/${row.ticket}/chat`}
        className="text-blue-500 hover:underline"
      >
        View all transactions
      </Link>
    ),
  },
];

const data: DisputeRow[] = Array.from({ length: 8 }).map(() => ({
  date: "4 April 2025 : 14:03:09",
  name: faker.person.fullName(),
  ticket: faker.string.alphanumeric(9).toLowerCase(),
  userId: "wdsh1245w",
  email: faker.internet.email(),
  amount: faker.commerce.price({ min: 700, max: 900, dec: 0 }),
}));

export default function ActiveDispute() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRole, setSelectedRole] = useState("freelancer");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="space-y-6" style={{ backgroundColor: '#F0F0F3', minHeight: '100vh', padding: '20px' }}>
      {/* Header with All transaction button and Security Alerts */}
      <div className="flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', padding: '16px' }}>
        <button
          onClick={() => setActiveTab("all")}
          className="bg-[#002333] text-white text-sm font-medium transition-colors hover:bg-[#003344]"
          style={{
            width: '131px',
            height: '40px',
            borderRadius: '24px',
            padding: '9px 12px 10px 12px',
            gap: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          All transaction
        </button>
        <div className="text-gray-600 text-sm font-medium">
          Security Alerts
        </div>
      </div>

      {/* Filter Controls Section */}
      <div 
        className="flex items-center justify-between mx-auto"
        style={{
          width: '1116px',
          height: '52px',
          padding: '10px',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Left Group: Freelancer + View user + Search */}
        <div className="flex items-center gap-4">
          {/* Role Selector */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
            <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>

          {/* View User Button */}
          <button 
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
            style={{
              width: 'auto',
              minWidth: '94px',
              height: '32px',
              borderRadius: '4px',
              padding: '5px 16px 5px 16px'
            }}
          >
            View user
          </button>

          {/* Search Bar */}
          <div className="relative" style={{ width: '232px' }}>
            <input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                height: '32px',
                padding: '4px 12px 4px 12px',
                paddingRight: '40px'
              }}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Right Group: Date + Filter + Export */}
        <div className="flex items-center gap-4">
          {/* Date Selector */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              placeholder="Select date"
            />
          </div>

          {/* Filter Button */}
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Filter
          </button>

          {/* Export Report Button */}
          <button 
            className="bg-[#002333] hover:bg-[#003344] text-white text-sm font-medium transition-colors whitespace-nowrap"
            style={{
              minWidth: '122px',
              height: '32px',
              borderRadius: '25px',
              padding: '5px 16px 5px 16px'
            }}
          >
            Export Report
          </button>
        </div>
      </div>

      <DisputeTable columns={columns} data={data} />
    </div>
  );
}