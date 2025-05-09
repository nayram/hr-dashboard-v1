"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Update the HRPreferencesData interface to match the API structure
export interface HRPreferencesData {
  industryFocus: string[]
  companySize: string[]
  recruitmentFocus: string[]
  specializations: string[]
  workStyle: string
  languages: string[]
  additionalNotes: string
}

interface HRPreferencesProps {
  preferences: HRPreferencesData
  onUpdate: (preferences: HRPreferencesData) => void
  readOnly?: boolean
}

// Map API specialization values to user-friendly display labels
const specializationLabels: Record<string, string> = {
  Recruiting: "Recruiting",
  "De&I": "Diversity, Equity & Inclusion (DE&I)",
  "HR Ops": "HR Operations & Administration",
  "HR Performance": "Performance Management & Team Development",
  "Compensation & Benefit": "Compensation & Benefits Programs",
}

// The reverse mapping for display purposes
const specializationValues = Object.entries(specializationLabels).reduce(
  (acc, [value, label]) => {
    acc[label] = value
    return acc
  },
  {} as Record<string, string>,
)

export function HRPreferences({ preferences, onUpdate, readOnly = false }: HRPreferencesProps) {
  const { toast } = useToast()
  const [currentPreferences, setCurrentPreferences] = useState<HRPreferencesData>(preferences)
  const [showRecruitmentFocus, setShowRecruitmentFocus] = useState(
    currentPreferences.specializations.includes("Recruiting"),
  )

  // Update showRecruitmentFocus when specializations change
  useEffect(() => {
    setShowRecruitmentFocus(currentPreferences.specializations.includes("Recruiting"))
  }, [currentPreferences.specializations])

  // Update the handleInputChange function to properly handle arrays
  const handleInputChange = (field: keyof HRPreferencesData, value: any) => {
    const updated = { ...currentPreferences, [field]: value }
    setCurrentPreferences(updated)
  }

  const handleSave = () => {
    onUpdate(currentPreferences)
    toast({
      title: "Preferences saved",
      description: "Your HR preferences have been updated.",
    })
  }

  const handleIndustryChange = (industry: string) => {
    const industries = currentPreferences.industryFocus.includes(industry)
      ? currentPreferences.industryFocus.filter((i) => i !== industry)
      : [...currentPreferences.industryFocus, industry]

    handleInputChange("industryFocus", industries)
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    let specializations

    if (checked) {
      specializations = [...currentPreferences.specializations, specialization]
    } else {
      specializations = currentPreferences.specializations.filter((s) => s !== specialization)
    }

    handleInputChange("specializations", specializations)
  }

  // Helper functions for multi-select handling
  const handleCompanySizeChange = (size: string) => {
    const sizes = currentPreferences.companySize.includes(size)
      ? currentPreferences.companySize.filter((s) => s !== size)
      : [...currentPreferences.companySize, size]

    handleInputChange("companySize", sizes)
  }

  const handleRecruitmentFocusChange = (focus: string) => {
    const focuses = currentPreferences.recruitmentFocus.includes(focus)
      ? currentPreferences.recruitmentFocus.filter((f) => f !== focus)
      : [...currentPreferences.recruitmentFocus, focus]

    handleInputChange("recruitmentFocus", focuses)
  }

  const handleLanguageChange = (language: string) => {
    const languages = currentPreferences.languages.includes(language)
      ? currentPreferences.languages.filter((l) => l !== language)
      : [...currentPreferences.languages, language]

    handleInputChange("languages", languages)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Professional Preferences</CardTitle>
        <CardDescription>
          {readOnly
            ? "Specialized areas and preferences of this HR professional"
            : "Specify your specialized areas and preferences as an HR professional"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Grouped HR Specializations and Recruitment Focus */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-4 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Core HR Functions</h3>
            <div className="h-1 flex-1 bg-blue-100 rounded-full"></div>
          </div>

          {/* HR Specializations Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">HR Specializations</h3>
            <div className="bg-white p-4 rounded-lg space-y-2 border border-gray-100">
              {Object.entries(specializationLabels).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spec-${value.replace(/\s+/g, "-").toLowerCase()}`}
                    checked={currentPreferences.specializations.includes(value)}
                    onCheckedChange={(checked) => {
                      handleSpecializationChange(value, !!checked)
                    }}
                    disabled={readOnly}
                  />
                  <Label
                    htmlFor={`spec-${value.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`${
                      readOnly && !currentPreferences.specializations.includes(value) ? "text-gray-400" : ""
                    }`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Recruitment Focus Section - Only shown when "Recruiting" is selected */}
          <div
            className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
              showRecruitmentFocus ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 my-0 py-0"
            }`}
          >
            <h3 className="text-lg font-medium">Recruitment Focus</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-2">
                {currentPreferences.recruitmentFocus.map((focus) => (
                  <Badge key={focus} variant="secondary" className="px-3 py-1">
                    {focus}
                    {!readOnly && (
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRecruitmentFocusChange(focus)}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {!readOnly && (
                <div className="flex gap-2 mt-3">
                  <Select
                    onValueChange={(value) => {
                      if (value && !currentPreferences.recruitmentFocus.includes(value)) {
                        handleRecruitmentFocusChange(value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recruitment focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business Development">Business Development</SelectItem>
                      <SelectItem value="Design (UI/UX)">Design (UI/UX)</SelectItem>
                      <SelectItem value="Content Creation">Content Creation</SelectItem>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Human Resources (HR)">Human Resources (HR)</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Customer Success">Customer Success</SelectItem>
                      <SelectItem value="Tech & IT roles">Tech & IT roles</SelectItem>
                      <SelectItem value="Sales & Business Development">Sales & Business Development</SelectItem>
                      <SelectItem value="Design & Marketing">Design & Marketing</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Industry Focus Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Industry Focus</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentPreferences.industryFocus.map((industry) => (
              <Badge key={industry} variant="secondary" className="px-3 py-1">
                {industry}
                {!readOnly && (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleIndustryChange(industry)}
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  if (value && !currentPreferences.industryFocus.includes(value)) {
                    handleIndustryChange(value)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="Non-profit">Non-profit</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Company Size Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Size Preference</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentPreferences.companySize.map((size) => (
              <Badge key={size} variant="secondary" className="px-3 py-1">
                {size}
                {!readOnly && (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleCompanySizeChange(size)}
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  if (value && !currentPreferences.companySize.includes(value)) {
                    handleCompanySizeChange(value)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early Stage Startups">Early Stage Startups</SelectItem>
                  <SelectItem value="Startups / Scale ups">Startups / Scale ups</SelectItem>
                  <SelectItem value="Seed Startups (1-10 employees)">Seed Startups (1-10 employees)</SelectItem>
                  <SelectItem value="Series A-B Startups (10-100 employees)">
                    Series A-B Startups (10-100 employees)
                  </SelectItem>
                  <SelectItem value="Series C-D Startups (50-500 employees)">
                    Series C-D Startups (50-500 employees)
                  </SelectItem>
                  <SelectItem value="Scale-ups +500 employees">Scale-ups +500 employees</SelectItem>
                  <SelectItem value="Small Businesses (1-50 employees)">Small Businesses (1-50 employees)</SelectItem>
                  <SelectItem value="Medium Businesses (50-500 employees)">
                    Medium Businesses (50-500 employees)
                  </SelectItem>
                  <SelectItem value="Medium Businesses (50-250 employees)">
                    Medium Businesses (50-250 employees)
                  </SelectItem>
                  <SelectItem value="Large Companies (+500 employees)">Large Companies (+500 employees)</SelectItem>
                  <SelectItem value="Large Corporations (250+ employees)">
                    Large Corporations (250+ employees)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Style Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferred Work Style</h3>
          <Select
            value={currentPreferences.workStyle}
            onValueChange={(value) => handleInputChange("workStyle", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select work style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strategic">Strategic (focus on long-term planning)</SelectItem>
              <SelectItem value="operational">Operational (focus on day-to-day execution)</SelectItem>
              <SelectItem value="consultative">Consultative (advisory approach)</SelectItem>
              <SelectItem value="hands-on">Hands-on (direct involvement)</SelectItem>
              <SelectItem value="collaborative">Collaborative (team-oriented)</SelectItem>
              <SelectItem value="independent">Independent (self-directed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Languages Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Languages</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentPreferences.languages.map((language) => (
              <Badge key={language} variant="secondary" className="px-3 py-1">
                {language}
                {!readOnly && (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleLanguageChange(language)}
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  if (value && !currentPreferences.languages.includes(value)) {
                    handleLanguageChange(value)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English 🇬🇧">English 🇬🇧</SelectItem>
                  <SelectItem value="French 🇫🇷">French 🇫🇷</SelectItem>
                  <SelectItem value="Spanish 🇪🇸">Spanish 🇪🇸</SelectItem>
                  <SelectItem value="Italian 🇮🇹">Italian 🇮🇹</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="Portuguese 🇵🇹">Portuguese 🇵🇹</SelectItem>
                  <SelectItem value="Dutch 🇳🇱">Dutch 🇳🇱</SelectItem>
                  <SelectItem value="German 🇩🇪">German 🇩🇪</SelectItem>
                  <SelectItem value="Swedish 🇸🇪">Swedish 🇸🇪</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Additional Notes Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Notes</h3>
          <Textarea
            value={currentPreferences.additionalNotes}
            onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
            placeholder="Any additional information about your preferences or expertise..."
            disabled={readOnly}
            className="min-h-[100px]"
          />
        </div>

        {!readOnly && (
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Save All Preferences</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
