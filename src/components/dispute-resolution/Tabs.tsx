import React from "react";
import PillTabs from "../tabs/pill-tabs";
import { JSX } from "react";

interface TabItem {
  label: string;
  value: string;
  component: JSX.Element;
}

interface DisputeTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export default function DisputeTabs({ tabs, defaultValue = "unassigned", className }: DisputeTabsProps) {
  return (
    <PillTabs
      tabs={tabs}
      defaultValue={defaultValue}
      className={className}
    />
  );
}