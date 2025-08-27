"use client"

import TalentLayout from "@/components/talent/TalentLayout";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;


return (
    <TalentLayout>
        {id}
    </TalentLayout>
)
}