"use client"
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  id: string | number;
  title: string;
  description: string;
  date: string;
  image?: string;
}

interface PortfolioCarouselProps {
  title?: string;
  items: PortfolioItem[];
  itemsPerPage?: number;
}

export default function PortfolioCarousel({
  title = "Portfolio",
  items,
  itemsPerPage = 3,
}: PortfolioCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const next = () => {
    setIndex((prev) =>
      Math.min(prev + itemsPerPage, items.length - itemsPerPage)
    );
  };

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
            disabled={items.length <= itemsPerPage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {Math.floor(index / itemsPerPage) + 1} /{" "}
            {Math.ceil(items.length / itemsPerPage)}
          </span>
          <Button
            onClick={next}
            variant="outline"
            size="sm"
            className="p-2 bg-transparent"
            disabled={items.length <= itemsPerPage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.slice(index, index + itemsPerPage).map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination dots */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i * itemsPerPage)}
              className={`w-2 h-2 rounded-full ${
                Math.floor(index / itemsPerPage) === i
                  ? "bg-gray-800"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
