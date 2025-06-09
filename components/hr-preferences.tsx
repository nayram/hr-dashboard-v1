"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile } from "@/lib/api"
import { Loader2 } from "lucide-react"

// Update the HRPreferencesData interface to match the API structure
export interface HRPreferencesData {
  industryFocus: string[] // This will map to preferences.industries in the API
  companySize: string[]
  projectLifeSpan: string[] // Maps to preferences.projectLifeSpan in the API
  workStyle: string // Keep for backward compatibility
  setupType: string // New field that maps to the API
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
  "Compensation & Benefits": "Compensation & Benefits Programs",
  "Handle people ops & HR admin": "Handle people ops & HR admin",
  "Help teams perform better": "Help teams perform better",
}

// Industry focus options from the API
const industryOptions = [
  "Technology & Software",
  "Consumer Goods & E-commerce",
  "Finance, Insurance & Fintech",
  "Healthcare & Life Sciences",
  "Media, Entertainment & Creative",
  "Industrial & Manufacturing",
  "Education & EdTech",
  "Travel, Hospitality & Lifestyle",
  "Nonprofit, Government & Public Sector",
  "Professional & Business Services",
  "Other(s)",
]

export function HRPreferences({ preferences, onUpdate, readOnly = false }: HRPreferencesProps) {
  const { toast } = useToast()
  const { token, updateUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [currentPreferences, setCurrentPreferences] = useState<HRPreferencesData>({
    ...preferences,
    // Initialize setupType from the API value, fall back to workStyle for backward compatibility
    setupType: preferences.setupType || preferences.workStyle || "",
    projectLifeSpan: preferences.projectLifeSpan || [],
  })

  // Update the handleInputChange function to properly handle arrays
  const handleInputChange = (field: keyof HRPreferencesData, value: any) => {
    const updated = { ...currentPreferences, [field]: value }
    setCurrentPreferences(updated)
  }

  const handleSave = async () => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your preferences",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Format preferences according to the API schema
      const preferencesData = {
        preferences: {
          industries: currentPreferences.industryFocus,
          companySize: currentPreferences.companySize,
          projectLifeSpan: currentPreferences.projectLifeSpan.length > 0 ? currentPreferences.projectLifeSpan : ["Long-term projects (more than 2 months)"],
        },
        languages: currentPreferences.languages,
        setupType: currentPreferences.setupType,
      }

      // Send the preferences data to the API
      const updatedUser = await updateUserProfile(token, preferencesData)

      // Update the user context with the new data
      updateUser(updatedUser)

      // Update the parent component's state
      onUpdate({
        ...currentPreferences,
        // Ensure workStyle is also updated for backward compatibility
        workStyle: currentPreferences.setupType,
      })

      toast({
        title: "Preferences saved",
        description: "Your HR preferences have been updated.",
      })
    } catch (error) {
      console.error("Failed to save preferences:", error)
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleIndustryChange = (industry: string) => {
    const industries = currentPreferences.industryFocus.includes(industry)
      ? currentPreferences.industryFocus.filter((i) => i !== industry)
      : [...currentPreferences.industryFocus, industry]

    handleInputChange("industryFocus", industries)
  }

  // Helper functions for multi-select handling
  const handleCompanySizeChange = (size: string) => {
    const sizes = currentPreferences.companySize.includes(size)
      ? currentPreferences.companySize.filter((s) => s !== size)
      : [...currentPreferences.companySize, size]

    handleInputChange("companySize", sizes)
  }

  const handleLanguageChange = (language: string) => {
    const languages = currentPreferences.languages.includes(language)
      ? currentPreferences.languages.filter((l) => l !== language)
      : [...currentPreferences.languages, language]

    handleInputChange("languages", languages)
  }

  const handleProjectDurationChange = (duration: string) => {
    const durations = currentPreferences.projectLifeSpan.includes(duration)
      ? currentPreferences.projectLifeSpan.filter((d) => d !== duration)
      : [...currentPreferences.projectLifeSpan, duration]

    handleInputChange("projectLifeSpan", durations)
  }

  return (
    <Card>
      <CardContent className="space-y-8">
        {/* Grouped HR Specializations and Recruitment Focus */}
        

        <Separator />

        {/* Industry Focus Section - Updated with API options */}
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
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Project Duration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Duration</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentPreferences.projectLifeSpan.map((duration) => (
              <Badge key={duration} variant="secondary" className="px-3 py-1">
                {duration}
                {!readOnly && (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleProjectDurationChange(duration)}
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
                  if (value && !currentPreferences.projectLifeSpan.includes(value)) {
                    handleProjectDurationChange(value)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short projects">Short projects</SelectItem>
                  <SelectItem value="Long projects">Long projects</SelectItem>
                  <SelectItem value="Short-term project (up to 2 months)">Short-term project (up to 2 months)</SelectItem>
                  <SelectItem value="Long-term projects (more than 2 months)">Long-term projects (more than 2 months)</SelectItem>
                  <SelectItem value="Quick consultation (around 2 hours)">Quick consultation (around 2 hours)</SelectItem>
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
                  <SelectItem value="Corporates">
                    Corporates
                  </SelectItem>
                  <SelectItem value="SMEs">SMEs</SelectItem>
                  <SelectItem value="Startups / Scaleups">Startups / Scaleups</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Setup Section (formerly Work Style) */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Work Setup</h3>
          <Select
            value={currentPreferences.setupType}
            onValueChange={(value) => handleInputChange("setupType", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select work setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Onsite">Onsite</SelectItem>
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

        {!readOnly && (
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save All Preferences"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
