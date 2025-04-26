import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { EditIcon, TrashIcon, WarningIcon } from "../../../../public/icon";
import { Stack } from "@/components/ui/stack";

export default function UserAddWorkExperienceDefaultState() {
  const [isExperienceAdded] = useState(true);
  return (
    <div className="relative font-normal text-base text-neutral-800 h-screen">
      {/* shared header */}
      <Stack className="font-semibold space-y-4">
        <p className="text-neutral-500">5/10</p>
        <h1 className="text-lg">
          Share your work experience, what are your relevant work experiences.
        </h1>
        <p className="font-normal text-xs">
          Freelancers who add their relevant work experiences wins client trust.
          But if you’re just starting out, you can still create a great profile.
          Just head on to the next page.
        </p>
      </Stack>
      <div className="mt-8">
        {isExperienceAdded && (
          <div className="bg-light-gray p-4 rounded-[6px] mb-4">
            <div className="flex justify-between items-center">
              <Stack className="space-y-5">
                <Stack className="space-y-2.5">
                  <h3 className="font-medium">Software Engineer</h3>
                  <div>
                    <p className="text-xs font-normal">
                      Microsoft | January 2021 - present
                    </p>
                    <p className="mt-1.5 text-xs text-neutral-600">
                      USA, New Jersey
                    </p>
                  </div>
                </Stack>
                <p className="text-xs text-neutral-600">
                  This is your job experience description section. Lorem ipsum.
                </p>
              </Stack>
              <Stack className="space-y-2.5">
                <EditIcon />
                <TrashIcon />
              </Stack>
            </div>
          </div>
        )}
        <Button className="flex border border-neutral-800 text-xs rounded-full gap-1.5 py-1.5 px-2.5">
          <Plus /> Add experience
        </Button>
      </div>
      {!isExperienceAdded && (
        <span className="flex gap-2 mt-4 items-center text-xs text-custom-red">
          <WarningIcon /> Add at least one item
        </span>
      )}
    </div>
  );
}
