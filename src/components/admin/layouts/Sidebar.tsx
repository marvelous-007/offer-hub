import { ArrowUpIcon, BarChart3Icon, BoxIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import NavItem from "../components/NavItems";

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-gray-50">
      <div className="flex items-center gap-2 p-6">
        <Image src="/logo.svg" alt="Offer Hub Logo" width={32} height={32} />
        <h1 className="text-xl font-bold">Offer Hub</h1>
      </div>

      <nav className="space-y-1 px-3">
        <NavItem
          icon={<BarChart3Icon className="h-5 w-5" />}
          label="Dashboard"
          active
        />
        <NavItem
          icon={<UsersIcon className="h-5 w-5" />}
          label="User management"
        />
        <NavItem
          icon={<BarChart3Icon className="h-5 w-5" />}
          label="Platform monitoring"
        />
        <NavItem
          icon={<BoxIcon className="h-5 w-5" />}
          label="Dispute resolution"
        />
      </nav>

      <div className="absolute bottom-0 w-64 border-t p-3">
        <NavItem
          icon={<ArrowUpIcon className="h-5 w-5 rotate-90" />}
          label="Logout"
          className="text-red-500"
        />
      </div>
    </div>
  );
}
