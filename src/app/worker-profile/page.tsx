import React from "react";
import WorkerDetailsCard from "@/components/Profile/workerDetailsCard";

const workerDetailsProps = {
  workerInfo: {
    name: "Santiago Villarreal",
    role: "AI Engineer",
    joiningDate: "March 2020",
  },
  statistics: {
    jobsDeliveredOnTime: 9,
    jobsCompletedWithoutBudget: 9,
    acceptanceRate: 9,
  },
  location: {
    country: "Italy",
    localTime: "20:23",
  },
  rate: {
    pricePerJob: 100.01,
  },
  contacts: {
    email: "santivillarley1010@gmail.com",
    phone: "86776886",
  },
};

export default function Page() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <WorkerDetailsCard
        workerInfo={workerDetailsProps.workerInfo}
        statistics={workerDetailsProps.statistics}
        location={workerDetailsProps.location}
        rate={workerDetailsProps.rate}
        contacts={workerDetailsProps.contacts}
      />
    </div>
  );
}
