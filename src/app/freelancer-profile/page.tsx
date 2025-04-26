"use client";

import StepsController from "@/components/freelancer-profile/steps";

import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { BackwardIcon } from "../../../public/icon";

export default function FreelancerProfilePage() {
  return (
    <div className="min-h-screen px-4 py-8 relative">
      <div className="max-w-xl mx-auto">
        <StepsController />
      </div>
      {/* steps controller will be used to dynamically change the content of the button */}
      <Footer>
        <div className="flex justify-between items-center">
          <BackwardIcon />
          <div className="flex gap-2">
            <Button className="bg-neutral-600 p-4 text-neutral-800 rounded-[20px]">
              Skip
            </Button>
            <Button className="bg-neutral-800 text-neutral-300 rounded-full p-4">
              Add Education
            </Button>
          </div>
        </div>
      </Footer>
    </div>
  );
}
