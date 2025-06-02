"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { HRPreferences, type HRPreferencesData } from "@/components/hr-preferences"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { useAuth } from "@/contexts/auth-context"
import { UsernameCreationModal } from "@/components/username-creation-modal"
import { Copy, ExternalLink, AlertCircle, Mail, Phone, MapPin, Linkedin, Loader2 } from "lucide-react"
import { MonthYearPicker } from "@/components/month-year-picker"
import { YearPicker } from "@/components/year-picker"
import { format } from "date-fns"
import { updateUserProfile } from "@/lib/api"

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, token, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [usernameRedirectPath, setUsernameRedirectPath] = useState<string | undefined>()
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    monday: false,
    tuesday: false,
    wednessday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  })
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("17:00")
  const [timezone, setTimezone] = useState<string>("Europe/Paris")

  // Update the profile state initialization to include profileImage
  const [profile, setProfile] = useState({
    name: "",
    title: "HR Professional",
    email: "",
    phone: "",
    location: "",
    about: "",
    linkedin: "",
    twitter: "",
    profileImage: {
      filePath: "",
      publicUrl: "",
      contentType: "",
      uploadedAt: ""
    },
    skills: [] as string[],
    experience: [
      {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        year: "",
      },
    ],
    preferences: {
      industryFocus: [] as string[],
      companySize: [] as string[],
      recruitmentFocus: [] as string[],
      specializations: [] as string[],
      workStyle: "",
      setupType: "",
      languages: [] as string[],
      additionalNotes: "",
    } as HRPreferencesData,
  })

  // Helper function to parse date string to Date object
  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null

    // Handle MM/YYYY format
    const parts = dateStr.split("/")
    if (parts.length === 2) {
      const month = Number.parseInt(parts[0], 10) - 1 // JS months are 0-indexed
      const year = Number.parseInt(parts[1], 10)
      if (!isNaN(month) && !isNaN(year)) {
        return new Date(year, month, 1)
      }
    }

    return null
  }

  // Helper function to format Date to string
  const formatDateToString = (date: Date | null): string => {
    if (!date) return ""
    return format(date, "MM/yyyy")
  }

  // Helper function to sort experiences by startDate (most recent first)
  const sortExperiencesByDate = (experiences: any[]) => {
    return [...experiences].sort((a, b) => {
      // Handle "Present" for end date (should be considered as the most recent)
      if (a.endDate === "Present" && b.endDate !== "Present") return -1
      if (a.endDate !== "Present" && b.endDate === "Present") return 1

      // Compare start dates (most recent first)
      const dateA = parseDateString(a.startDate)
      const dateB = parseDateString(b.startDate)

      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1

      return dateB.getTime() - dateA.getTime()
    })
  }

  // Update the useEffect that loads user data to handle the new profilePicture structure
  useEffect(() => {
    if (user) {
      setProfile((prev) => {
        // Sort experience by startDate (most recent first) only when loading from API
        const sortedExperience = user.experience ? sortExperiencesByDate(user.experience) : prev.experience

        // Sort education by year (most recent first)
        const sortedEducation = user.education
          ? [...user.education].sort((a, b) => {
              const yearA = Number.parseInt(a.year) || 0
              const yearB = Number.parseInt(b.year) || 0
              return yearB - yearA // Most recent first
            })
          : prev.education

        return {
          ...prev,
          name: user.name ? `${user.name} ${user.lastName || ""}`.trim() : prev.name,
          email: user.email || prev.email,
          phone: user.phoneNumber || prev.phone,
          location: user.location?.city ? `${user.location.city}, ${user.location.country}` : prev.location,
          about: user.bio || prev.about,
          linkedin: user.linkedin,
          twitter: user.twitter,
          profileImage:  user.profilePicture,
          skills: user.skills || prev.skills,
          experience: sortedExperience,
          education: sortedEducation,
          preferences: {
            ...prev.preferences,
            // Map the API industries values to industryFocus
            industryFocus: user.preferences?.industries || prev.preferences.industryFocus,
            companySize: user.preferences?.companySize || prev.preferences.companySize,
            recruitmentFocus: user.preferences?.recruitmentRoles || prev.preferences.recruitmentFocus,
            specializations: user.preferences?.specialization || prev.preferences.specializations,
            // Map setupType directly from the API
            setupType: user.preferences?.setupType || prev.preferences.setupType,
            // Keep workStyle for backward compatibility
            workStyle: user.preferences?.workStyle || prev.preferences.workStyle,
            languages: user.languages || prev.preferences.languages,
          },
        }
      })
    }
  }, [user])

  // Update availability when user data is loaded
  useEffect(() => {
    if (user?.availability) {
      // Update weekly availability days
      if (user.availability.days) {
        const newAvailability = {
          monday: false,
          tuesday: false,
          wednessday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        }

        // Convert days to lowercase for case-insensitive matching
        user.availability.days.forEach((day: string) => {
          const dayLower = day.toLowerCase()
          if (dayLower in newAvailability) {
            newAvailability[dayLower] = true
          }
        })

        setAvailability(newAvailability)
      }

      // Update working hours
      if (user.availability.startTime) {
        setStartTime(user.availability.startTime)
      }

      if (user.availability.endTime) {
        setEndTime(user.availability.endTime)
      }

      // Update timezone if available, otherwise use Europe/Paris as default
      setTimezone(user.availability.timeZone || "Europe/Paris")
    }
  }, [user])

  // Update the handleCopyProfileLink function to use username consistently
  const handleCopyProfileLink = () => {
    // Check if user has a username
    if (!user?.username) {
      setUsernameRedirectPath("copy")
      setShowUsernameModal(true)
      return
    }

    const profileLink = `${window.location.origin}/view/${user.username}`
    navigator.clipboard.writeText(profileLink)
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    })
  }

  const handleViewPublicProfile = () => {
    // Check if user has a username
    if (!user?.username) {
      setUsernameRedirectPath("view")
      setShowUsernameModal(true)
      return
    }

    // If they do have a username, open the public profile
    window.open(`/view/${user.username}`, "_blank")
  }

  const handleUsernameCreated = (username: string) => {
    setShowUsernameModal(false)

    // Handle the action based on the redirect path
    if (usernameRedirectPath === "copy") {
      const profileLink = `${window.location.origin}/view/${username}`
      navigator.clipboard.writeText(profileLink)
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      })
    } else if (usernameRedirectPath === "view") {
      window.open(`/view/${username}`, "_blank")
    }

    setUsernameRedirectPath(undefined)
  }

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  // Update the prepareProfileData function to not include profileImage
  // (since it's now handled separately through the profile picture upload API)
  const prepareProfileData = () => {
    // Split name into first and last name
    const nameParts = profile.name.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Parse location into city and country
    let city = ""
    let country = ""
    if (profile.location) {
      const locationParts = profile.location.split(",")
      city = locationParts[0]?.trim() || ""
      country = locationParts[1]?.trim() || ""
    }

    // Format availability data
    const selectedDays = Object.entries(availability)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day.toLowerCase())

    // Prepare the final data object according to the API schema
    return {
      name: firstName,
      lastName,
      phoneNumber: profile.phone,
      bio: profile.about || "\n", // Ensure bio is never empty
      title: profile.title,
      linkedin: profile.linkedin || "",
      email: profile.email,
      address: "", // Not used in our UI but required by API
      profilePicture: profile.profileImage,
      availability: {
        days: selectedDays,
        startTime: startTime, // Use 24-hour format directly
        endTime: endTime, // Use 24-hour format directly
        timeZone: timezone,
      },
      location: {
        country: country,
        city: city || "Unknown",
        type: profile.preferences.setupType || "Remote",
      },
      setupType: profile.preferences.setupType || "Remote",
      languages: profile.preferences.languages || [],
      monthlyBudget: 0, // Default values for required fields
      hourlyBudget: 0,
      yearsOfExperience: 0,
      preferences: {
        companySize: profile.preferences.companySize || [],
        industries: profile.preferences.industryFocus || [],
        recruitmentRoles: profile.preferences.recruitmentFocus || [],
        projectLifeSpan: ["Long-term projects (more than 2 months)"], // Default value
        specialization: profile.preferences.specializations || [],
      },
      cv: [],
      experience: profile.experience.map((exp) => ({
        title: exp.title || "",
        company: exp.company || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description || "",
        location: exp.location || "",
      })),
      education: profile.education.map((edu) => ({
        degree: edu.degree || "",
        institution: edu.institution || "",
        year: edu.year || "",
      })),
      skills: profile.skills || [],
      payment: {
        organizationType: "As a freelance", // Default value
      },
    }
  }

  const handleSaveProfile = async () => {
    // Check for date validation errors in all experiences
    const hasDateErrors = profile.experience.some((exp) => exp.dateError)

    if (hasDateErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix the date errors in your experience entries",
        variant: "destructive",
      })
      return
    }

    // Don't sort experiences before saving - maintain the order as edited by the user

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your profile",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Prepare the data for the API according to the required schema
      const profileData = prepareProfileData()

      // Send the data to the API
      const updatedUser = await updateUserProfile(token, profileData)

      // Update the user context with the new data
      updateUser(updatedUser)

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully saved",
      })
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePreferences = (preferences: HRPreferencesData) => {
    setProfile((prev) => ({
      ...prev,
      preferences,
    }))
  }

  const handleProfileImageChange = (image: {
      filePath: string,
      publicUrl: string,
      contentType: string,
      uploadedAt: string
      }) => {
    setProfile((prev) => ({
      ...prev,
      profileImage: image,
    }))
  }

  const handleSaveAvailability = async () => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your availability",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Get selected days as an array of lowercase day names
      const selectedDays = Object.entries(availability)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day.toLowerCase())

      // Prepare availability data according to the API schema
      const availabilityData = {
        availability: {
          days: selectedDays,
          startTime: startTime, // Use 24-hour format directly
          endTime: endTime, // Use 24-hour format directly
          timeZone: timezone,
        },
      }

      // Send only the availability data to the API
      const updatedUser = await updateUserProfile(token, availabilityData)

      // Update the user context with the new data
      updateUser(updatedUser)

      toast({
        title: "Availability saved",
        description: "Your availability settings have been updated.",
      })
    } catch (error) {
      console.error("Failed to save availability:", error)
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle start date change
  const handleStartDateChange = (index: number, date: Date | null) => {
    const newExp = [...profile.experience]
    newExp[index].startDate = date ? formatDateToString(date) : ""

    // Clear date validation error when start date changes
    if (newExp[index].dateError) {
      delete newExp[index].dateError
    }

    // Validate dates if both start and end dates exist
    validateDates(newExp, index)

    setProfile({ ...profile, experience: newExp })
  }

  // Handle end date change
  const handleEndDateChange = (index: number, date: Date | null) => {
    const newExp = [...profile.experience]
    newExp[index].endDate = date ? formatDateToString(date) : ""

    // Validate dates if both start and end dates exist
    validateDates(newExp, index)

    setProfile({ ...profile, experience: newExp })
  }

  // Handle "Present" toggle for end date
  const handlePresentToggle = (index: number, isPresent: boolean) => {
    const newExp = [...profile.experience]
    newExp[index].endDate = isPresent ? "Present" : ""

    // Clear date validation error when toggling to "Present"
    if (isPresent && newExp[index].dateError) {
      delete newExp[index].dateError
    }

    setProfile({ ...profile, experience: newExp })
  }

  // Handle education year change
  const handleEducationYearChange = (index: number, year: string) => {
    const newEdu = [...profile.education]
    newEdu[index].year = year
    setProfile({ ...profile, education: newEdu })
  }

  // Validate dates
  const validateDates = (experiences: any[], index: number) => {
    const exp = experiences[index]

    // Skip validation if end date is "Present" or either date is missing
    if (!exp.startDate || !exp.endDate || exp.endDate === "Present") {
      delete exp.dateError
      return
    }

    const startDate = parseDateString(exp.startDate)
    const endDate = parseDateString(exp.endDate)

    if (startDate && endDate && endDate < startDate) {
      exp.dateError = "End date must be after start date"
    } else {
      delete exp.dateError
    }
  }

  // Check if a date string is "Present"
  const isDatePresent = (dateStr: string): boolean => {
    return dateStr.toLowerCase() === "present"
  }

  // Handle removing an experience entry
  const handleRemoveExperience = (index: number) => {
    const newExperience = [...profile.experience]
    newExperience.splice(index, 1)

    // Ensure there's always at least one experience entry
    if (newExperience.length === 0) {
      newExperience.push({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      })
    }

    setProfile({ ...profile, experience: newExperience })
    toast({
      title: "Experience removed",
      description: "The experience entry has been removed from your profile.",
    })
  }

  // Handle removing an education entry
  const handleRemoveEducation = (index: number) => {
    const newEducation = [...profile.education]
    newEducation.splice(index, 1)

    // Ensure there's always at least one education entry
    if (newEducation.length === 0) {
      newEducation.push({
        degree: "",
        institution: "",
        year: "",
      })
    }

    setProfile({ ...profile, education: newEducation })
    toast({
      title: "Education removed",
      description: "The education entry has been removed from your profile.",
    })
  }

  // Handle adding a new experience entry
  const handleAddExperience = () => {
    const newExperience = [
      ...profile.experience,
      {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
        dateError: undefined,
      },
    ]

    setProfile({ ...profile, experience: newExperience })
  }

  // Only sort experiences for display in read-only mode
  const displayExperiences = isEditing ? profile.experience : sortExperiencesByDate(profile.experience)

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My HR Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyProfileLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Profile Link
          </Button>
          {user?.username ? (
            <Link href={`/view/${user.username}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={handleViewPublicProfile}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
          )}
        </div>
      </div>

      {!user?.username && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Username Required</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You need to create a username to share your profile.
            <Button
              variant="link"
              className="p-0 h-auto text-yellow-700 font-semibold hover:text-yellow-900"
              onClick={() => setShowUsernameModal(true)}
            >
              Create username now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Profile Visibility</AlertTitle>
        <AlertDescription>
          Your public profile is visible to anyone with the link. Only share with trusted contacts.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">HR Preferences</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Info</CardTitle>
                  {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                {isEditing ? (
                  <ProfileImageUpload
                    initialImage={profile.profileImage.publicUrl}
                    name={profile.name}
                    onImageChange={handleProfileImageChange}
                    className="mb-4"
                  />
                ) : (
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.profileImage.publicUrl || ""} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profile.linkedin || ""}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <p className="text-gray-500">{profile.title}</p>
                      {user?.username && <p className="text-sm text-gray-400 mt-1">@{user.username}</p>}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-gray-500" />
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                      className="min-h-[120px]"
                      placeholder="Write a brief description about yourself, your experience, and your HR expertise..."
                    />
                  ) : (
                    <p>{profile.about || "No bio information provided yet."}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Textarea
                        id="skills"
                        value={profile.skills.join(", ")}
                        onChange={(e) =>
                          setProfile({ ...profile, skills: e.target.value.split(",").map((skill) => skill.trim()) })
                        }
                        placeholder="Talent Acquisition, Employee Relations, Performance Management, etc."
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {displayExperiences.map((exp, index) => (
                      <div key={index} className="space-y-2">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                                <Input
                                  id={`job-title-${index}`}
                                  value={exp.title}
                                  onChange={(e) => {
                                    const newExp = [...profile.experience]
                                    const expIndex = profile.experience.findIndex((item) => item === exp)
                                    if (expIndex !== -1) {
                                      newExp[expIndex].title = e.target.value
                                      setProfile({ ...profile, experience: newExp })
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`company-${index}`}>Company</Label>
                                <Input
                                  id={`company-${index}`}
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExp = [...profile.experience]
                                    const expIndex = profile.experience.findIndex((item) => item === exp)
                                    if (expIndex !== -1) {
                                      newExp[expIndex].company = e.target.value
                                      setProfile({ ...profile, experience: newExp })
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                                <MonthYearPicker
                                  value={parseDateString(exp.startDate)}
                                  onChange={(date) => {
                                    const expIndex = profile.experience.findIndex((item) => item === exp)
                                    if (expIndex !== -1) {
                                      handleStartDateChange(expIndex, date)
                                    }
                                  }}
                                  placeholder="Select start date"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`end-date-${index}`}>End Date</Label>
                                <MonthYearPicker
                                  value={isDatePresent(exp.endDate) ? null : parseDateString(exp.endDate)}
                                  onChange={(date) => {
                                    const expIndex = profile.experience.findIndex((item) => item === exp)
                                    if (expIndex !== -1) {
                                      handleEndDateChange(expIndex, date)
                                    }
                                  }}
                                  placeholder="Select end date"
                                  allowPresent={true}
                                  isPresent={isDatePresent(exp.endDate)}
                                  onPresentChange={(isPresent) => {
                                    const expIndex = profile.experience.findIndex((item) => item === exp)
                                    if (expIndex !== -1) {
                                      handlePresentToggle(expIndex, isPresent)
                                    }
                                  }}
                                  className={exp.dateError ? "border-red-500" : ""}
                                />
                                {exp.dateError && (
                                  <div className="flex items-center mt-1 text-red-500 text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {exp.dateError}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-${index}`}>Location</Label>
                              <Input
                                id={`location-${index}`}
                                value={exp.location || ""}
                                onChange={(e) => {
                                  const newExp = [...profile.experience]
                                  const expIndex = profile.experience.findIndex((item) => item === exp)
                                  if (expIndex !== -1) {
                                    newExp[expIndex].location = e.target.value
                                    setProfile({ ...profile, experience: newExp })
                                  }
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${index}`}>Description</Label>
                              <Textarea
                                id={`description-${index}`}
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...profile.experience]
                                  const expIndex = profile.experience.findIndex((item) => item === exp)
                                  if (expIndex !== -1) {
                                    newExp[expIndex].description = e.target.value
                                    setProfile({ ...profile, experience: newExp })
                                  }
                                }}
                              />
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const expIndex = profile.experience.findIndex((item) => item === exp)
                                  if (expIndex !== -1) {
                                    handleRemoveExperience(expIndex)
                                  }
                                }}
                                disabled={profile.experience.length <= 1}
                                className="text-xs"
                              >
                                Remove Experience
                              </Button>
                            </div>
                            {index < displayExperiences.length - 1 && <Separator className="my-4" />}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{exp.title || "No title provided"}</h3>
                                <p className="text-gray-500">{exp.company || "No company provided"}</p>
                                {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                              </div>
                              <span className="text-sm text-gray-500">
                                {exp.startDate && exp.endDate
                                  ? `${exp.startDate} - ${exp.endDate}`
                                  : exp.period || "No period provided"}
                              </span>
                            </div>
                            <p>{exp.description || "No description provided"}</p>
                            {index < displayExperiences.length - 1 && <Separator className="my-4" />}
                          </>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" onClick={handleAddExperience}>
                        Add Experience
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="space-y-2">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>Degree</Label>
                              <Input
                                id={`degree-${index}`}
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...profile.education]
                                  newEdu[index].degree = e.target.value
                                  setProfile({ ...profile, education: newEdu })
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`institution-${index}`}>Institution</Label>
                                <Input
                                  id={`institution-${index}`}
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const newEdu = [...profile.education]
                                    newEdu[index].institution = e.target.value
                                    setProfile({ ...profile, education: newEdu })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`year-${index}`}>Year</Label>
                                <YearPicker
                                  value={edu.year}
                                  onChange={(year) => handleEducationYearChange(index, year)}
                                  placeholder="Select graduation year"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveEducation(index)}
                                disabled={profile.education.length <= 1}
                                className="text-xs"
                              >
                                Remove Education
                              </Button>
                            </div>
                            {index < profile.education.length - 1 && <Separator className="my-4" />}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{edu.degree || "No degree provided"}</h3>
                                <p className="text-gray-500">{edu.institution || "No institution provided"}</p>
                              </div>
                              <span className="text-sm text-gray-500">{edu.year || "No year provided"}</span>
                            </div>
                            {index < profile.education.length - 1 && <Separator className="my-4" />}
                          </>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            education: [...profile.education, { degree: "", institution: "", year: "" }],
                          })
                        }
                      >
                        Add Education
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <HRPreferences preferences={profile.preferences} onUpdate={handleUpdatePreferences} />
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <CardDescription>Let others know when you're available for meetings and consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Weekly Availability</h3>
                  <div className="space-y-4">
                    {Object.entries(availability).map(([day, isAvailable]) => (
                      <div key={day} className="flex items-center justify-between">
                        <Label htmlFor={`day-${day}`} className="capitalize">
                          {day}
                        </Label>
                        <Switch id={`day-${day}`} checked={isAvailable} onCheckedChange={() => toggleDay(day)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Availability</h3>
                  <div className="border rounded-md p-4">
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Working Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Time Zone</h3>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Select Your Time Zone</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    {/* Americas */}
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Sao_Paulo">São Paulo (Brazil)</option>
                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (Argentina)</option>

                    {/* Europe & Africa */}
                    <option value="Europe/London">London (UK)</option>
                    <option value="Europe/Paris">Central European Time (Paris, Berlin)</option>
                    <option value="Europe/Helsinki">Eastern European Time (Helsinki, Athens)</option>
                    <option value="Europe/Moscow">Moscow (Russia)</option>
                    <option value="Africa/Cairo">Cairo (Egypt)</option>
                    <option value="Africa/Johannesburg">Johannesburg (South Africa)</option>
                    <option value="Africa/Lagos">Lagos (Nigeria)</option>
                    <option value="Africa/Nairobi">Nairobi (Kenya)</option>

                    {/* Asia & Oceania */}
                    <option value="Asia/Dubai">Dubai (UAE)</option>
                    <option value="Asia/Kolkata">Mumbai, New Delhi (India)</option>
                    <option value="Asia/Bangkok">Bangkok (Thailand)</option>
                    <option value="Asia/Singapore">Singapore</option>
                    <option value="Asia/Shanghai">Beijing, Shanghai (China)</option>
                    <option value="Asia/Tokyo">Tokyo (Japan)</option>
                    <option value="Asia/Seoul">Seoul (South Korea)</option>
                    <option value="Australia/Sydney">Sydney (Australia)</option>
                    <option value="Pacific/Auckland">Auckland (New Zealand)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={handleSaveAvailability} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Username Creation Modal */}
      <UsernameCreationModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSuccess={handleUsernameCreated}
        redirectPath={usernameRedirectPath}
      />
    </div>
  )
}
