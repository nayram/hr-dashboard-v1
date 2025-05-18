"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MonthYearPickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  allowPresent?: boolean
  isPresent?: boolean
  onPresentChange?: (isPresent: boolean) => void
  className?: string
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  allowPresent = false,
  isPresent = false,
  onPresentChange,
  className,
}: MonthYearPickerProps) {
  const [date, setDate] = useState<Date | null>(value || null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarView, setCalendarView] = useState<Date>(value || new Date())
  const [yearView, setYearView] = useState(false)

  // Update internal state when value prop changes
  useEffect(() => {
    setDate(value || null)
  }, [value])

  const handleSelect = (selectedDate: Date | null) => {
    setDate(selectedDate)
    onChange(selectedDate)
    setCalendarOpen(false)
  }

  const handlePresentToggle = () => {
    if (onPresentChange) {
      onPresentChange(!isPresent)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarView((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateYear = (direction: "prev" | "next") => {
    setCalendarView((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setFullYear(newDate.getFullYear() - 1)
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1)
      }
      return newDate
    })
  }

  const toggleYearView = () => {
    setYearView(!yearView)
  }

  const selectYear = (year: string) => {
    setCalendarView((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(Number.parseInt(year))
      return newDate
    })
    setYearView(false)
  }

  // Generate years for selection (20 years back, 10 years forward)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - 20 + i).toString())

  return (
    <div className={cn("relative", className)}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && !isPresent && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isPresent ? "Present" : date ? format(date, "MM/yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            {/* Custom header for month/year navigation */}
            <div className="flex items-center justify-between">
              {!yearView ? (
                <>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" onClick={toggleYearView}>
                    {format(calendarView, "MMMM yyyy")}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="icon" onClick={() => navigateYear("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Select value={calendarView.getFullYear().toString()} onValueChange={selectYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => navigateYear("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {!yearView && (
              <Calendar
                mode="single"
                selected={date || undefined}
                onSelect={handleSelect}
                month={calendarView}
                onMonthChange={setCalendarView}
                className="rounded-md border"
                disabled={disabled}
                initialFocus
              />
            )}

            {yearView && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(calendarView.getFullYear(), i, 1)
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-9"
                      onClick={() => {
                        setCalendarView(monthDate)
                        setYearView(false)
                      }}
                    >
                      {format(monthDate, "MMM")}
                    </Button>
                  )
                })}
              </div>
            )}

            {allowPresent && (
              <div className="flex justify-between pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleSelect(null)} className="text-sm">
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePresentToggle}
                  className={cn("text-sm", isPresent && "bg-primary text-primary-foreground hover:bg-primary/90")}
                >
                  Present
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
