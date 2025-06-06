"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Linkedin, MapPin, Loader2, Clock, Calendar, Globe, Briefcase, Users, Target } from "lucide-react"
import Link from "next/link"
import type { HRPreferencesData } from "@/components/hr-preferences"
import { getUserByUsername } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { FreelancerTypeSelector } from "@/components/freelancer-type-selector"

// Map API specialization values to user-friendly display labels
const specializationLabels: Record<string, string> = {
  Recruiting: "Recruiting",
  "De&I": "Diversity, Equity & Inclusion (DE&I)",
  "HR Ops": "HR Operations & Administration",
  "HR Performance": "Performance Management & Team Development",
  "Compensation & Benefit": "Compensation & Benefits Programs",
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserByUsername(params.username)
        setProfile(userData)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setError(error instanceof Error ? error.message : "Failed to load profile")
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [params.username, toast])

  // Helper function to get readable work setup
  const getWorkSetupLabel = (setupType: string) => {
    switch (setupType) {
      case "remote":
        return "Remote"
      case "hybrid":
        return "Hybrid"
      case "onsite":
        return "Onsite"
      default:
        return setupType || "Not specified"
    }
  }

  // Helper function to get user-friendly specialization label
  const getSpecializationLabel = (specialization: string) => {
    return specializationLabels[specialization] || specialization
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md px-4">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Profile Not Found</h3>
          <p className="text-sm text-gray-500">
            The profile you're looking for doesn't exist or is no longer available.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Format the profile data
  const formattedProfile = {
    name: profile.name ? `${profile.name} ${profile.lastName || ""}`.trim() : "HR Professional",
    title: profile.title || "HR Professional",
    email: profile.email || "",
    phone: profile.phoneNumber || "",
    location: profile.location?.city ? `${profile.location.city}, ${profile.location.country}` : "",
    about: profile.bio || "No bio provided",
    linkedin: profile.linkedin || "",
    twitter: profile.twitter || "",
    profileImage: profile.profilePicture?.publicUrl || null,
    skills: profile.skills || [],
    type: profile.type || [],
    availability: {
      days: profile.availability?.days || [],
      hours: profile.availability?.hours || "9:00 AM - 5:00 PM",
      startTime: profile.availability?.startTime || "09:00",
      endTime: profile.availability?.endTime || "17:00",
      timezone: profile.availability?.timeZone || "Europe/Paris",
      preferences: profile.availability?.preferences || ["Virtual meetings"],
    },
    preferences: {
      ...profile.preferences,
      industryFocus: profile.preferences?.industries || [],
      companySize: profile.preferences?.companySize || [],
      recruitmentFocus: profile.preferences?.recruitmentRoles || [],
      specializations: profile.preferences?.specialization || [],
      // Use setupType from API directly
      setupType: profile.preferences?.setupType || "",
      // Keep workStyle for backward compatibility
      workStyle: profile.preferences?.workStyle || "",
      languages: profile.languages || [],
      additionalNotes: profile.preferences?.additionalNotes || "",
    } as HRPreferencesData,
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header Section */}
      <Card className="border-0 shadow-none mb-8">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={formattedProfile.profileImage || ""} alt={formattedProfile.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {formattedProfile.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <CardTitle className="text-3xl md:text-4xl mb-2">{formattedProfile.name}</CardTitle>
                <CardDescription className="text-xl text-gray-600 mb-2">{formattedProfile.title}</CardDescription>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {formattedProfile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{formattedProfile.location}</span>
                    </div>
                  )}
                  {formattedProfile.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      <a
                        href={formattedProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed space-y-3">
                {formattedProfile.about
                  .split("\n")
                  .map((paragraph, index) => {
                    // Skip empty paragraphs
                    if (paragraph.trim() === "") return null

                    return (
                      <p key={index} className="text-gray-700">
                        {paragraph}
                      </p>
                    )
                  })
                  .filter(Boolean)}
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills & Expertise
              </CardTitle>
              <CardDescription>Core competencies and technical skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formattedProfile.skills.length > 0 ? (
                  formattedProfile.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills provided.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Freelancer Types */}
          {formattedProfile.type.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Freelancer Services
                </CardTitle>
                <CardDescription>Types of freelancing services offered</CardDescription>
              </CardHeader>
              <CardContent>
                <FreelancerTypeSelector
                  freelancerTypes={formattedProfile.type}
                  onChange={() => {}} // Read-only
                  readOnly={true}
                />
              </CardContent>
            </Card>
          )}

          {/* HR Specialization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                HR Specialization & Preferences
              </CardTitle>
              <CardDescription>Areas of expertise and working preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* HR Specializations */}
              {formattedProfile.preferences.specializations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">HR Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {formattedProfile.preferences.specializations.map((spec: string) => (
                      <Badge key={spec} variant="default" className="text-sm">
                        {getSpecializationLabel(spec)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Industry Focus */}
              {formattedProfile.preferences.industryFocus.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">Industry Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {formattedProfile.preferences.industryFocus.map((industry: string) => (
                      <Badge key={industry} variant="outline" className="text-sm">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Company Size & Recruitment Focus */}
              <div className="grid md:grid-cols-2 gap-6">
                {formattedProfile.preferences.companySize.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-900">Company Size Preference</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.companySize.map((size: string) => (
                        <Badge key={size} variant="outline" className="text-sm">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formattedProfile.preferences.recruitmentFocus.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-900">Recruitment Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.recruitmentFocus.map((focus: string) => (
                        <Badge key={focus} variant="outline" className="text-sm">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Work Setup & Languages */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">Work Setup</h4>
                  <Badge variant="secondary" className="text-sm">
                    {getWorkSetupLabel(formattedProfile.preferences.setupType)}
                  </Badge>
                </div>

                {formattedProfile.preferences.languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-900">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.languages.map((language: string) => (
                        <Badge key={language} variant="secondary" className="text-sm">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Availability
              </CardTitle>
              <CardDescription>When this expert is available for client work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Available Days
                </h4>
                <p className="text-sm text-gray-600">
                  {formattedProfile.availability.days.length > 0
                    ? formattedProfile.availability.days
                        .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                        .join(", ")
                    : "Not specified"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Working Hours
                </h4>
                <p className="text-sm text-gray-600">
                  {formattedProfile.availability.startTime && formattedProfile.availability.endTime
                    ? `${formattedProfile.availability.startTime} - ${formattedProfile.availability.endTime}`
                    : formattedProfile.availability.hours}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Time Zone
                </h4>
                <p className="text-sm text-gray-600">{formattedProfile.availability.timezone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Specializations</span>
                <Badge variant="outline" className="text-xs">
                  {formattedProfile.preferences.specializations.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skills</span>
                <Badge variant="outline" className="text-xs">
                  {formattedProfile.skills.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Industries</span>
                <Badge variant="outline" className="text-xs">
                  {formattedProfile.preferences.industryFocus.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Languages</span>
                <Badge variant="outline" className="text-xs">
                  {formattedProfile.preferences.languages.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
