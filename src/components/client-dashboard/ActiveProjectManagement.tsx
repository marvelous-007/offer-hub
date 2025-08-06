import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  MoreHorizontal,
  DollarSign,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Milestone, ProjectData } from "@/types";

const mockProjectData: ProjectData = {
  id: "1",
  title: "Mobile App UI/UX design",
  freelancer: {
    name: "John Doe",
    avatar: "/profile.jpeg",
    location: "United states",
    timezone: "10:32 EST",
  },
  totalPayment: "$2,182.56",
  inEscrow: "$2,182.56",
  milestones: [
    {
      id: "1",
      name: "Prototype",
      amount: "$450",
      status: "in-escrow",
      icon: <Clock className="h-4 w-4 text-orange-500" />,
    },
    {
      id: "2",
      name: "Design Mockup",
      amount: "$500",
      status: "paid",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      id: "3",
      name: "Concept Model",
      amount: "$600",
      status: "paid",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      id: "4",
      name: "Sample Design",
      amount: "$700",
      status: "paid",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
  ],
};

export function ActiveProjectManagement() {
  const project = mockProjectData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Project Title */}
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
        {project.title}
      </h1>

      {/* Main Project Card */}
      <Card className="w-full bg-white shadow-sm">
        <CardContent className="p-6">
          {/* Project Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.freelancer.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.freelancer.location} {project.freelancer.timezone}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View project details</DropdownMenuItem>
                  <DropdownMenuItem>Download files</DropdownMenuItem>
                  <DropdownMenuItem>Contact freelancer</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Cancel project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Payment Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Timeline
            </h3>
            <div className="space-y-1"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
