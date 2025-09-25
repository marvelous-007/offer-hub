"use client"

import { useSearch } from "@/hooks/use-search"
import SearchLoading from "./search-loading"

interface SearchResultsProps {
  children: React.ReactNode
  showLoading?: boolean
}

export default function SearchResults({ 
  children, 
  showLoading = true 
}: SearchResultsProps) {
  const { isLoading } = useSearch()

  if (isLoading && showLoading) {
    return <SearchLoading />
  }

  return <>{children}</>
}
