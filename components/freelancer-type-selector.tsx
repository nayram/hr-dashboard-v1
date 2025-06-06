"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight, Briefcase, GraduationCap, Users, Target } from "lucide-react"

export interface FreelancerType {
  id: string
  values: string[]
  experience?: number
}

interface FreelancerTypeSelectorProps {
  freelancerTypes: FreelancerType[]
  onChange: (types: FreelancerType[]) => void
  readOnly?: boolean
}

const FREELANCER_OPTIONS = {
  "HR professional": {
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    options: ["DE&I", "Compensation & Benefits", "Handle people ops & HR admin", "Help teams perform better"],
  },
  Trainer: {
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    options: ["Leadership", "AI & Data", "Marketing & Growth", "Sales", "Product & Design", "Tech", "Impact"],
  },
  Mentor: {
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    options: ["Leadership", "Career Growth", "Performance", "Business Strategy"],
  },
  Recruiter: {
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    options: [
      "Tech & IT roles",
      "Product",
      "Design & Marketing",
      "Sales & Business Development",
      "Executive & Leadership",
      "People",
      "HR",
      "Finance & Legal",
      "Operations",
      "Support & CS",
    ],
  },
}

export function FreelancerTypeSelector({ freelancerTypes, onChange, readOnly = false }: FreelancerTypeSelectorProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(freelancerTypes.map((type) => type.id)))

  const toggleTypeExpansion = (typeId: string) => {
    if (readOnly) return

    setExpandedTypes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(typeId)) {
        newSet.delete(typeId)
      } else {
        newSet.add(typeId)
      }
      return newSet
    })
  }

  const isTypeSelected = (typeId: string) => {
    return freelancerTypes.some((type) => type.id === typeId)
  }

  const getTypeData = (typeId: string) => {
    return freelancerTypes.find((type) => type.id === typeId)
  }

  const handleTypeToggle = (typeId: string) => {
    if (readOnly) return

    if (isTypeSelected(typeId)) {
      // Remove the type
      onChange(freelancerTypes.filter((type) => type.id !== typeId))
      setExpandedTypes((prev) => {
        const newSet = new Set(prev)
        newSet.delete(typeId)
        return newSet
      })
    } else {
      // Add the type
      onChange([...freelancerTypes, { id: typeId, values: [], experience: 1 }])
      setExpandedTypes((prev) => new Set([...prev, typeId]))
    }
  }

  const handleSubOptionToggle = (typeId: string, subOption: string) => {
    if (readOnly) return

    const updatedTypes = freelancerTypes.map((type) => {
      if (type.id === typeId) {
        const newValues = type.values.includes(subOption)
          ? type.values.filter((v) => v !== subOption)
          : [...type.values, subOption]
        return { ...type, values: newValues }
      }
      return type
    })
    onChange(updatedTypes)
  }

  const handleExperienceChange = (typeId: string, experience: number) => {
    if (readOnly) return

    const updatedTypes = freelancerTypes.map((type) => {
      if (type.id === typeId) {
        return { ...type, experience }
      }
      return type
    })
    onChange(updatedTypes)
  }

  if (readOnly) {
    return (
      <div className="space-y-4">
        {freelancerTypes.length === 0 ? (
          <p className="text-gray-500 text-sm">No freelancer types selected</p>
        ) : (
          freelancerTypes.map((type) => {
            const config = FREELANCER_OPTIONS[type.id as keyof typeof FREELANCER_OPTIONS]
            if (!config) return null

            const Icon = config.icon

            return (
              <div key={type.id} className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{type.id}</h3>
                    {type.experience && (
                      <p className="text-sm text-gray-600">{type.experience} year(s) of experience</p>
                    )}
                  </div>
                </div>

                {type.values.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {type.values.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Select the types of freelancing services you offer and specify your experience in each area.
      </div>

      {Object.entries(FREELANCER_OPTIONS).map(([typeId, config]) => {
        const Icon = config.icon
        const isSelected = isTypeSelected(typeId)
        const isExpanded = expandedTypes.has(typeId)
        const typeData = getTypeData(typeId)

        return (
          <div
            key={typeId}
            className={`rounded-lg border ${isSelected ? config.borderColor : "border-gray-200"} ${isSelected ? config.bgColor : "bg-white"} transition-all duration-200`}
          >
            <div className="p-4 cursor-pointer" onClick={() => handleTypeToggle(typeId)}>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleTypeToggle(typeId)}
                  className="pointer-events-none"
                />
                <Icon className={`h-5 w-5 ${isSelected ? config.color : "text-gray-400"}`} />
                <div className="flex-1">
                  <h3 className={`font-medium ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{typeId}</h3>
                  <p className="text-sm text-gray-500">{config.options.length} specialization options available</p>
                </div>
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTypeExpansion(typeId)
                    }}
                    className="p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {isSelected && isExpanded && (
              <div className="px-4 pb-4 space-y-4">
                <Separator />

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Years of Experience</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={typeData?.experience || 1}
                    onChange={(e) => handleExperienceChange(typeId, Number.parseInt(e.target.value) || 1)}
                    className="w-24"
                  />
                </div>

                <Separator />

                {/* Sub-options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Specializations</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {config.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${typeId}-${option}`}
                          checked={typeData?.values.includes(option) || false}
                          onCheckedChange={() => handleSubOptionToggle(typeId, option)}
                        />
                        <Label htmlFor={`${typeId}-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Show selected count */}
                  {typeData && typeData.values.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {typeData.values.map((value) => (
                          <Badge key={value} variant="secondary" className="text-xs">
                            {value}
                            <button
                              onClick={() => handleSubOptionToggle(typeId, value)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {freelancerTypes.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
          <div className="text-sm text-gray-600">
            You've selected {freelancerTypes.length} freelancer type(s) with{" "}
            {freelancerTypes.reduce((total, type) => total + type.values.length, 0)} total specializations.
          </div>
        </div>
      )}
    </div>
  )
}
