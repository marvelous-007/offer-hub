"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Props = {
  title?: string
  person?: string
  date?: string
  avatarSrc?: string
  menuIcon?: React.ReactNode
}

export function ProjectCard({
  title = "Project title",
  person = "Freelancer Name",
  date = "Today",
  avatarSrc = "/placeholder.svg?height=40&width=40",
  menuIcon,
}: Props) {
  return (
    <article className="rounded-xl border bg-white">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{title}</h3>

            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={avatarSrc || "/placeholder.svg"} alt="Avatar" fill sizes="32px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">{person}</p>
                <p className="text-xs text-slate-500">{date}</p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-slate-100">
              {menuIcon}
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">Report issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <Button className="w-full rounded-full bg-slate-700 hover:bg-slate-600 text-white" variant="default">
            Message
          </Button>
        </div>
      </div>
    </article>
  )
}

