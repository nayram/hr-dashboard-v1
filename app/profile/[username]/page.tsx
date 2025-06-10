"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Linkedin, Mail, MapPin, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import type { HRPreferencesData } from "@/components/hr-preferences"
import { getUserByUsername } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
    name: profile.name ? `${profile.name} ${profile.lastName || ""}`.trim() : "",
    title: profile.title || "",
    email: profile.email || "",
    phone: profile.phoneNumber || "",
    location: profile.location?.city ? `${profile.location.city}, ${profile.location.country}` : "",
    about: profile.bio || "",
    linkedin: profile.linkedin || "",
    twitter: profile.twitter || "",
    profileImage: profile.profilePicture?.publicUrl || null,
    skills: profile.skills || [],
    experience: profile.experience ? [...profile.experience] : [],
    education: profile.education ? [...profile.education] : [],
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
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formattedProfile.profileImage || ""} alt={formattedProfile.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {formattedProfile.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl">{formattedProfile.name}</CardTitle>
              <CardDescription className="text-lg">{formattedProfile.title}</CardDescription>
              <p className="text-sm text-gray-500">@{params.username}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {formattedProfile.skills.slice(0, 4).map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {formattedProfile.skills.length > 4 && (
                  <Badge variant="outline">+{formattedProfile.skills.length - 4} more</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p>{formattedProfile.about}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">HR Specialization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Industry Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.industryFocus.map((industry: string) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Company Size Preference</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.companySize.map((size: string) => (
                        <Badge key={size} variant="outline">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Work Setup</h4>
                    <p>{getWorkSetupLabel(formattedProfile.preferences.setupType)}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {formattedProfile.preferences.languages.map((language: string) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{formattedProfile.email}</span>
                  </div>
                  {formattedProfile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formattedProfile.phone}</span>
                    </div>
                  )}
                  {formattedProfile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formattedProfile.location}</span>
                    </div>
                  )}
                  {formattedProfile.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-500" />
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Days</h4>
                    <p>{formattedProfile.availability.days.join(", ")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Hours</h4>
                    <p>
                      {formattedProfile.availability.startTime && formattedProfile.availability.endTime
                        ? `${formattedProfile.availability.startTime} - ${formattedProfile.availability.endTime}`
                        : formattedProfile.availability.hours}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Time Zone</h4>
                    <p>{formattedProfile.availability.timezone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Meeting Preferences</h4>
                    <p>{formattedProfile.availability.preferences.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formattedProfile.skills.length > 0 ? (
                      formattedProfile.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
