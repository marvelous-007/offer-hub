"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { MoreHorizontal } from "lucide-react"
import type { Project } from "@/lib/mockData/projects-list-mock"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"

interface ProjectsListProps {
  projects: Project[]
  itemsPerPage?: number
}

export function ProjectsList({ projects, itemsPerPage = 6 }: ProjectsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalCount = projects.length
  const paginationRange = usePagination({
    totalCount,
    pageSize: itemsPerPage,
    currentPage,
  })

  // Calculate the current page data
  const currentPageData = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const onNext = () => {
    if (currentPage < Math.ceil(totalCount / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-slate-500">
        No items to display.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Projects List */}
      <div className="space-y-4">
        {currentPageData.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            person={project.person}
            date={project.date}
            avatarSrc={project.avatarSrc}
            menuIcon={<MoreHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  onPrevious()
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {paginationRange.map((pageNumber, index) => {
              if (pageNumber === "DOTS") {
                return (
                  <PaginationItem key={`dots-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(pageNumber as number)
                    }}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onNext()
                }}
                className={
                  currentPage === Math.ceil(totalCount / itemsPerPage) 
                    ? "pointer-events-none opacity-50" 
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}