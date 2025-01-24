'use client';

import WorkerHeader from "@/components/Profile/WorkerHeader";

import workerBanner from '@/assets/img/workerBanner.svg';
import workerProfile from '@/assets/img/workerProfile.svg';

export default function WorkerProfile() {
  return (
    <WorkerHeader
      bannerImage={workerBanner}
      profileImage={workerProfile}
      name="Josh Johnson"
      role="Designer"
      isVerified={true}
    />
  );
}
