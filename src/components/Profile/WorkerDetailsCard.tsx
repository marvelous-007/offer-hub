import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";
type WorkerDetailsProps = {
  workerInfo: {
    name: string;
    role: string;
    joiningDate: string;
  };
  statistics: {
    jobsDeliveredOnTime: number;
    jobsCompletedWithoutBudget: number;
    acceptanceRate: number;
  };
  location: {
    country: string;
    localTime: string;
  };
  rate: {
    pricePerJob: number;
  };
  contacts: {
    email: string;
    phone: string;
  };
};

export default function WorkerDetailsCard({
  workerInfo,
  statistics,
  location,
  rate,
}: WorkerDetailsProps) {
  return (
    <Card className="border border-gray-200 rounded-lg w-fit shadow-none px-8 font-bold">
      <CardHeader className="">
        <CardTitle className="text-4xl text-center">
          {workerInfo.name}
        </CardTitle>
        <CardDescription className="text-center text-2xl">
          {workerInfo.role}
        </CardDescription>
        <div className="flex gap-14 w-full">
          <CalendarCheck color="#002333EC" />
          <p className="text-base text-muted-foreground">
            Joined {workerInfo.joiningDate}
          </p>
        </div>
      </CardHeader>

    </Card>
  );
}
