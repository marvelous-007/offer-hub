
'use client';

import { useSearchParams } from "next/navigation";
import ResolvedDisputeTable from "@/components/dispute-resolution/ResolvedDisputeTable";
import Toolbar from "@/components/dispute-resolution/Toolbar";
import DisputeTabs from "@/components/dispute-resolution/DisputeTabs";

export default function DisputeResolutionPage() {
  const tab = useSearchParams().get("tab") || "unassigned";

  return (
    <div className="p-6">
      <DisputeTabs activeTab={tab} />
      <Toolbar />
      {tab === "resolved" && <ResolvedDisputeTable />}
      {tab === "unassigned" && <div>Unassigned disputes coming soon</div>}
      {tab === "active" && <div>Active disputes coming soon</div>}
    </div>
  );
}

import DisputeResolutionPage from "@/components/dispute-resolution/DisputeResolutionPage";

export default function Page() {
  return <DisputeResolutionPage />;
} 