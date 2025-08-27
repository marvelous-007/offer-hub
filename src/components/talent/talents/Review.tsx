"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string | number;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  projectTitle?: string;
}

interface ReviewsCarouselProps {
  title?: string;
  reviews: Review[];
  renderStars: (rating: number) => React.ReactNode; // pass your star renderer here
}

export default function ReviewsCarousel({
  title = "Reviews",
  reviews,
  renderStars,
}: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const next = () => setIndex((prev) => Math.min(prev + 1, reviews.length - 1));

  return (
    <div className="bg-white rounded-lg p-6 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={prev}
            variant="outline"
            size="sm"
            className="p-2 bg-transparent"
            disabled={reviews.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {index + 1} / {reviews.length}
          </span>
          <Button
            onClick={next}
            variant="outline"
            size="sm"
            className="p-2 bg-transparent"
            disabled={reviews.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Review Content */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <div
            key={reviews[index].id}
            className="border-b border-gray-100 pb-4 last:border-b-0"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                {reviews[index].clientName}
              </h4>
              <div className="flex items-center gap-1">
                {renderStars(reviews[index].rating)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{reviews[index].date}</p>
            <p className="text-gray-700 leading-relaxed">
              {reviews[index].comment}
            </p>
            {reviews[index].projectTitle && (
              <p className="text-sm text-teal-600 mt-2">
                Project: {reviews[index].projectTitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Pagination dots */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${
                index === i ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
