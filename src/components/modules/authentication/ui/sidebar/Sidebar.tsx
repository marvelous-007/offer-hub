"use client";

import { useThemeStore } from "@/core/store/theme/store";
import { CgProfile } from "react-icons/cg";
import { LuUniversity } from "react-icons/lu";
import { MdOutlineDiscount } from "react-icons/md";

interface SettingsSidebarProps {
  currentTab: string;
  className?: string;
  onTabChange: (tab: string) => void;
}

const SettingsSidebar = ({
  currentTab,
  onTabChange,
  className,
}: SettingsSidebarProps) => {
  const { theme } = useThemeStore();

  return (
    <>
      <aside className={`w-full md:w-1/6 rounded-xl p-4 ${className}`}>
        <nav className="flex flex-col gap-2">
          <div
            className={`rounded-lg flex items-center px-3 gap-3 ${
              currentTab === "profile"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-primary-50"
                : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-primary-50"
            }`}
          >
            <CgProfile className="h-5 w-5" />
            <button
              onClick={() => onTabChange("profile")}
              className="text-left p-2 w-full h-full"
            >
              Profile
            </button>
          </div>

          <div
            className={`rounded-lg flex items-center px-3 gap-3 ${
              currentTab === "titles"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-primary-50"
                : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-primary-50"
            }`}
          >
            <LuUniversity className="h-5 w-5" />
            <button
              onClick={() => onTabChange("titles")}
              className="text-left p-2 w-full h-full"
            >
              Titles
            </button>
          </div>

          <div
            className={`rounded-lg flex items-center px-3 gap-3 ${
              currentTab === "discounts"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-primary-50"
                : theme === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-primary-50"
            }`}
          >
            <MdOutlineDiscount className="h-5 w-5" />
            <button
              onClick={() => onTabChange("discounts")}
              className="text-left p-2 w-full h-full"
            >
              Discounts
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SettingsSidebar;
