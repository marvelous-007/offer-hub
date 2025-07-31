import { useState } from "react";
import { users } from "@/data/landing-data";
import { User } from "@/interfaces/user.interface";

export function useFilteredUsers() {
  const [userType, setUserType] = useState<"Freelancer" | "Customer">("Freelancer");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userData, setUserData] = useState<User[]>(users);

  const getUserRole = (user: User): string => {
    if (
      user.name.toLowerCase().includes("freelancer") ||
      user.email.toLowerCase().includes("freelancer")
    )
      return "Freelancer";
    if (
      user.name.toLowerCase().includes("customer") ||
      user.email.toLowerCase().includes("customer")
    )
      return "Customer";
    if (user.id % 3 === 0) return "User";
    if (user.id % 3 === 1) return "Customer";
    return "Freelancer";
  };

  const filteredData = userData.filter((user) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const role = getUserRole(user);
    const matchesRole =
      roleFilter === "All" || role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "All" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleExport = () => {
    console.log("Exporting report...");
    alert("Report export initiated. This feature is currently stubbed.");
  };

  const handleViewFile = (userId: number) => {
    console.log(`Viewing file for user ID: ${userId}`);
  };

  const handleNotify = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleOverflowAction = (action: string, userId: number) => {
    const user = userData.find((u: User) => u.id === userId);
    if (!user) return;
    if (action === "modify") {
      setUserToEdit(user);
      setIsEditModalOpen(true);
    } else if (action === "view") {
      setSelectedUser(user);
      setIsViewModalOpen(true);
    } else {
      console.log(`Action ${action} for user ID: ${userId}`);
    }
  };

  return {
    userType,
    setUserType,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    date,
    setDate,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    setSelectedUser,
    isEditModalOpen,
    setIsEditModalOpen,
    userToEdit,
    setUserToEdit,
    userData,
    setUserData,
    isViewModalOpen,
    setIsViewModalOpen,
    filteredData,
    handleExport,
    handleViewFile,
    handleNotify,
    handleOverflowAction,
  };
}