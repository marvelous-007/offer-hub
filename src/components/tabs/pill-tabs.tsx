import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import clsx from "clsx";
import { PillTabsProps , TabItem } from "@/types";


export default function PillTabs({ tabs, defaultValue, className }: PillTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className={className || "w-full"}>
      <TabsList className="bg-transparent p-1 rounded-full inline-flex gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              "data-[state=active]:bg-[#002333] data-[state=active]:text-white",
              "data-[state=inactive]:text-[#002333]"
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}