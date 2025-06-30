"use client"

import { useState } from "react"
import { Check, ChevronDown, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MultiSelectFilterProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchable?: boolean
  isLoading?: boolean
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  searchable = false,
  isLoading = false,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredOptions = searchable
    ? options.filter((option) => option.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  const handleRemove = (option: string) => {
    onChange(selected.filter((item) => item !== option))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[2rem] p-2 bg-transparent"
          >
            <span className="truncate">{selected.length === 0 ? placeholder : `${selected.length} selected`}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8"
                />
              </div>
            )}
            <div className="p-1">
              {filteredOptions.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">No options available</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className={cn(
                      "flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent",
                      selected.includes(option) && "bg-accent",
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.includes(option) ? "bg-primary text-primary-foreground" : "opacity-50",
                      )}
                    >
                      {selected.includes(option) && <Check className="h-3 w-3" />}
                    </div>
                    <span className="truncate">{option}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
              <button className="ml-1 hover:bg-secondary-foreground/20 rounded-full" onClick={() => handleRemove(item)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
