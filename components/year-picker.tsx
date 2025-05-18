"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearPickerProps {
  value?: string
  onChange: (year: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  startYear?: number
  endYear?: number
}

export function YearPicker({
  value,
  onChange,
  placeholder = "Select year",
  disabled = false,
  className,
  startYear = 1950,
  endYear = new Date().getFullYear(),
}: YearPickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>(value || "")
  const [decade, setDecade] = useState<number>(Math.floor((Number(value) || new Date().getFullYear()) / 10) * 10)

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedYear(value || "")
  }, [value])

  // Generate years for the current decade view
  const getDecadeYears = () => {
    const years = []
    for (let i = 0; i < 10; i++) {
      const year = decade + i
      if (year >= startYear && year <= endYear) {
        years.push(year.toString())
      }
    }
    return years
  }

  // Generate all available years for the dropdown
  const getAllYears = () => {
    const years = []
    for (let year = endYear; year >= startYear; year--) {
      years.push(year.toString())
    }
    return years
  }

  const handleYearSelect = (year: string) => {
    setSelectedYear(year)
    onChange(year)
    setOpen(false)
  }

  const navigateDecade = (direction: "prev" | "next") => {
    setDecade((prev) => {
      const newDecade = direction === "prev" ? prev - 10 : prev + 10
      return Math.max(Math.floor(startYear / 10) * 10, Math.min(Math.floor(endYear / 10) * 10, newDecade))
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedYear && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedYear ? selectedYear : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          {/* Decade navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => navigateDecade("prev")} disabled={decade <= startYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={decade.toString()} onValueChange={(value) => setDecade(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select decade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: Math.floor((endYear - startYear) / 10) + 1 },
                  (_, i) => (Math.floor(startYear / 10) + i) * 10,
                ).map((decadeStart) => (
                  <SelectItem key={decadeStart} value={decadeStart.toString()}>
                    {decadeStart}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDecade("next")}
              disabled={decade >= Math.floor(endYear / 10) * 10}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Year grid */}
          <div className="grid grid-cols-3 gap-2 py-2">
            {getDecadeYears().map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                className="h-9"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* Quick selection dropdown */}
          <div className="pt-3 border-t">
            <Select value={selectedYear} onValueChange={handleYearSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jump to year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {getAllYears().map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
