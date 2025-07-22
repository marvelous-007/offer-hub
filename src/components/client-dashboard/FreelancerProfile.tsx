"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const portfolioItems = [
  {
    id: 1,
    title: "Mobile app design",
    image: "/portfolio/mobile1.png",
    date: "August 2024",
  },
  {
    id: 2,
    title: "Mobile app design",
    image: "/portfolio/mobile2.png",
    date: "August 2024",
  },
  {
    id: 3,
    title: "Website design",
    image: "/portfolio/website.png",
    date: "August 2024",
  },
  {
    id: 4,
    title: "Landing page design",
    image: "/portfolio/landing.png",
    date: "August 2024",
  },
  {
    id: 5,
    title: "Dashboard design",
    image: "/portfolio/dashboard1.png",
    date: "August 2024",
  },
  {
    id: 6,
    title: "Dashboard design",
    image: "/portfolio/dashboard2.png",
    date: "August 2024",
  },
];

const reviews = [
  {
    id: 1,
    name: "John Doe",
    date: "March 20, 2024",
    rating: 4,
    text: "Very helpful, and insightful. We look forward to a long lasting relationship with Mohsin and his team of lead generation experts.",
  },
  {
    id: 2,
    name: "Alex Smith",
    date: "April 15, 2025",
    rating: 5,
    text: "Incredibly useful and enlightening. We are excited about building a lasting partnership with Sarah and her team of marketing specialists.",
  },
  {
    id: 3,
    name: "Emily Johnson",
    date: "April 15, 2025",
    rating: 5,
    text: "Incredibly useful and enlightening. We are excited about building a lasting partnership with Sarah and her team of marketing specialists.",
  },
];

export default function FreelancerProfile() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);

  const visibleItems = portfolioItems.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleBack = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const reviewsPerPage = 3;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  const visibleReviews = reviews.slice(
    currentReviewPage * reviewsPerPage,
    currentReviewPage * reviewsPerPage + reviewsPerPage
  );

  const handleReviewsNext = () =>
    setCurrentReviewPage((prev) => Math.min(prev + 1, totalReviewPages - 1));
  const handleReviewsBack = () =>
    setCurrentReviewPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="space-y-10 px-4 pb-10 max-w-6xl mx-auto">
      {/* --- FREELANCER PROFILE SECTION --- */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="John D"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-600 text-lg font-semibold">John D</p>
            <h2 className="text-gray-900 text-2xl font-bold leading-tight">
              UI/UX designer | Brand designer |
              <br /> Figma pro
            </h2>
            <p className="text-teal-600 text-base mt-1">Canada</p>
          </div>
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-8">
          I am a UI/UX designer with 4 years of experience in creating
          user-friendly interfaces and enhancing user experiences. My passion
          lies in understanding user needs and translating them into intuitive
          designs that drive engagement and satisfaction.
        </p>

        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            aria-label="Like"
          >
            <Heart className="w-5 h-5" />
          </button>
          <Button
            variant="ghost"
            className="flex-1 rounded-full border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 px-8 py-3 text-lg font-medium"
          >
            Message
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-[#002333] rounded-full text-white hover:bg-[#002333]/90 px-8 py-3 text-lg font-medium"
          >
            Hire
          </Button>
        </div>
      </div>

      {/* --- PORTFOLIO SECTION --- */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={260}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleBack}
            disabled={currentPage === 0}
            className="text-sm text-gray-500 hover:text-teal-600 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentPage ? "bg-teal-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reviews</h2>

        <div className="space-y-6 mb-6">
          {visibleReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 fill-current ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09L5.64 12.09.763 7.91l6.36-.924L10 1l2.877 5.986 6.36.924-4.878 4.18 1.518 5.998z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleReviewsBack}
            disabled={currentReviewPage === 0}
            className="text-sm text-gray-500 hover:text-teal-600 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalReviewPages }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentReviewPage ? "bg-teal-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleReviewsNext}
            disabled={currentReviewPage === totalReviewPages - 1}
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
