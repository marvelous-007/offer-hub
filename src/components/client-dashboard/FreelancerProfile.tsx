"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MessageCircle, MapPin, DollarSign } from "lucide-react";

interface FreelancerProfileProps {
  freelancer?: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    bio: string;
    location: string;
    hourlyRate: number;
    totalEarnings: string;
    jobSuccess: number;
    totalJobs: number;
    portfolio: Array<{
      id: string;
      title: string;
      image: string;
      category: string;
    }>;
    reviews: Array<{
      id: string;
      clientName: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
}

export default function FreelancerProfile({
  freelancer,
}: FreelancerProfileProps) {
  // Default data if no freelancer prop is provided
  const defaultFreelancer = {
    id: "1",
    name: "Marcus Johnson",
    title: "UI/UX designer | Brand designer | Figma pro",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "I am a UI/UX designer with 4 years of experience in creating user-friendly and beautiful user interfaces that are providing for a perfect user experience of mobile applications. I specialize in print for the last year. With my technical programming background and a solid grasp of front-market dynamics, I am committed to my ability to gather and analyze user preferences. I am really passionate about creating designs that are not only visually appealing but also functional. I would love to help you create a design that will make your users happy and engaged. Let's work together to bring your vision to life!",
    location: "New York, USA",
    hourlyRate: 45,
    totalEarnings: "$50K+",
    jobSuccess: 98,
    totalJobs: 127,
    portfolio: [
      {
        id: "1",
        title: "Mobile app design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Mobile",
      },
      {
        id: "2",
        title: "Mobile app design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Mobile",
      },
      {
        id: "3",
        title: "Website design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Web",
      },
      {
        id: "4",
        title: "Landing page design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Web",
      },
      {
        id: "5",
        title: "Dashboard design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Dashboard",
      },
      {
        id: "6",
        title: "Dashboard design",
        image: "/placeholder.svg?height=200&width=300",
        category: "Dashboard",
      },
    ],
    reviews: [
      {
        id: "1",
        clientName: "John Doe",
        rating: 5,
        comment:
          "Very helpful and thoughtful. He has formed us a long lasting relationship with Marcus and his team of very professional experts.",
        date: "2 weeks ago",
      },
      {
        id: "2",
        clientName: "Alex Smith",
        rating: 5,
        comment:
          "Incredibly useful and straightforward. We are excited about building a lasting partnership with Sarah and her team of marketing specialists.",
        date: "1 month ago",
      },
      {
        id: "3",
        clientName: "Emily Johnson",
        rating: 5,
        comment:
          "Incredibly useful and straightforward. We are excited about building a lasting partnership with Sarah and her team of marketing specialists.",
        date: "2 months ago",
      },
    ],
  };

  const profile = freelancer || defaultFreelancer;

  const handleMessage = () => {
    // Handle message functionality
    console.log("Opening message dialog for:", profile.name);
  };

  const handleHire = () => {
    // Handle hire functionality
    console.log("Initiating hire process for:", profile.name);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={profile.avatar || "/placeholder.svg"}
                alt={`${profile.name} profile picture`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 mb-3">{profile.title}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />${profile.hourlyRate}/hr
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {profile.jobSuccess}% Job Success
                  </div>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {profile.totalEarnings}
                    </span>
                    <span className="text-gray-600 ml-1">earned</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {profile.totalJobs}
                    </span>
                    <span className="text-gray-600 ml-1">jobs completed</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                  onClick={handleMessage}
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleHire}
                >
                  Hire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
      </div>

      {/* Portfolio Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.portfolio.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              5.0 ({profile.reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {profile.reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {review.clientName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "{review.comment}"
              </p>
            </Card>
          ))}
        </div>

        {/* Reviews Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
