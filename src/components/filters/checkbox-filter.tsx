"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface CheckboxFilterProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  isLoading?: boolean
}

export function CheckboxFilter({ options, selected, onChange, isLoading = false }: CheckboxFilterProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, option])
    } else {
      onChange(selected.filter((item) => item !== option))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (options.length === 0) {
    return <div className="p-2 text-sm text-muted-foreground text-center">No options available</div>
  }

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${option}`}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => handleChange(option, !!checked)}
          />
          <Label htmlFor={`checkbox-${option}`} className="text-sm font-normal cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </div>
  )
}
