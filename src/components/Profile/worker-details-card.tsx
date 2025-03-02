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
      <Separator />
      <CardContent className="flex flex-col gap-4 mt-2">
        <p className="text-xl text-center text-muted-foreground">
          On time: {statistics.jobsDeliveredOnTime}%
        </p>
        <p className="text-xl text-center text-muted-foreground">
          Within Budget: {statistics.jobsCompletedWithoutBudget}%
        </p>
        <p className="text-xl text-center text-muted-foreground">
          AcceptanceRate: {statistics.acceptanceRate}%
        </p>
        <div className="flex justify-between    ">
          <p className="text-base text-center font-normal text-muted-foreground flex items-center">
            <Image width={20} height={20} alt="" src="/icons/italy.png" className="mr-2"/>
            {location.country}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              ({location.localTime})
            </span>
          </p>
          <p className="text-xl text-center text-[#002333EC] font-bold flex items-center">
            <Image width={20} height={20} alt="" src="/icons/dollar.png" className="mr-2"/>
            ${rate.pricePerJob}
            <span className="text-xs font-normal text-muted-foreground">
                {" "}
                per job
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="font-bold text-base bg-[#159A9C] rounded-3xl text-white">Contact Me</Button>
      </CardFooter>
    </Card>
  );
}
