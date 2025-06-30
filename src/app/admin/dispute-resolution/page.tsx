'use client';
import React, { useState } from "react";
import DisputeTabs from "@/components/dispute-resolution/Tabs";
import ActiveDisputeTable from "@/components/dispute-resolution/ActiveDisputeTable";
import DisputeChat from "@/components/dispute-resolution/DisputeChat";
import CloseConflictModal from "@/components/dispute-resolution/CloseConflictModal";
import UnassignedDispute from "@/components/dispute-resolution/views/unassigned-dispute";
import ResolvedDispute from "@/components/dispute-resolution/views/resolved-dispute";
import ActiveDispute from "@/components/dispute-resolution/views/active-dispute";

export default function DisputeResolutionPage() {
  const [viewingDisputeId, setViewingDisputeId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6">
      <DisputeTabs
        defaultValue="unassigned"
        tabs={[
          {
            label: "Unassigned dispute",
            value: "unassigned",
            component: <UnassignedDispute />,
          },
          {
            label: "Active",
            value: "active",
            component: <ActiveDispute/>
          },
          {
            label: "Resolved dispute",
            value: "resolved",
            component: <ResolvedDispute />,
          },
        ]}
      />
    </div>
  );
}