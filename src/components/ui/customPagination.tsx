"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const range = 2; 
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || 
      i === totalPages || 
      (i >= currentPage - range && i <= currentPage + range) 
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <Pagination className="flex items-center gap-2 justify-center">
      
      <PaginationPrevious
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-[#002333]"}
      >
        Previous
      </PaginationPrevious>

      
      <PaginationContent>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "number" ? (
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === currentPage}
                  className={page === currentPage ? "bg-[#002333] text-white cursor-pointer" : "text-[#002333] cursor-pointer"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationEllipsis className="text-[#B4BEC9]" />
            )}
          </React.Fragment>
        ))}
      </PaginationContent>

      
      <PaginationNext
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-[#002333]"}
      >
        Next
      </PaginationNext>
    </Pagination>
  );
}
