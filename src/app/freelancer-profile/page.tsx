"use client";

import StepsController from "@/components/freelancer-profile/steps";

import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";

import { ArrowLeft } from "lucide-react";

export default function FreelancerProfilePage() {
  return (
    <div className="relative">
      <StepsController />

      {/* <div>
        <Footer>
          <div className="mx-auto max-w-4xl flex justify-between items-center">
            <div>
              <Button variant="ghost" className="gap-1 rounded-full">
                <ArrowLeft size={18} /> Back
              </Button>
            </div>

            <div className="space-x-4">
              <Button
                variant="outline"
                className="border-[#149A9B] text-[#149A9B] hover:text-[#149A9B]
                  bg-transparent rounded-full md:min-w-36"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-work-experience-form"
                className="gap-1 bg-[#149A9B] text-white rounded-full md:min-w-36"
              >
                Add Education
              </Button>
            </div>
          </div>
        </Footer>
      </div> */}
    </div>
  );
}
