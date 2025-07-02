"use client"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterCategory = {
  id: string
  label: string
}

const categories: FilterCategory[] = [
  { id: "all", label: "All" },
  { id: "analytics", label: "Analytics" },
  { id: "creative", label: "Creative" },
  { id: "development", label: "Development" },
  { id: "security", label: "Security" },
  { id: "automation", label: "Automation" },
]

type ModelFilterProps = {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ModelFilter({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: ModelFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 space-y-4 items-start md:items-center justify-between mb-8">
      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "border border-white/20 bg-gradient-to-r from-white/8 to-white/5 backdrop-blur-md",
              "hover:border-white/30 hover:from-white/12 hover:to-white/8",
              selectedCategory === category.id
                ? "border-blue-400/50 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                : "text-gray-300 hover:text-white",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full bg-[#2a2a2a] backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:from-white/12 focus:to-white/8 transition-all duration-300"
        />
      </div>
    </div>
  )
}
