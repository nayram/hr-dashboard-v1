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
import { AlertCircle, Copy, ExternalLink, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { HRPreferences, type HRPreferencesData } from "@/components/hr-preferences"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { useAuth } from "@/contexts/auth-context"
// Import the LogoutButton component at the top of the file
import { LogoutButton } from "@/components/logout-button"

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })

  const [profile, setProfile] = useState({
    name: "",
    title: "HR Professional",
    email: "",
    phone: "",
    location: "",
    about: "",
    linkedin: "",
    twitter: "",
    profileImage: null as string | null,
    skills: [] as string[],
    experience: [
      {
        title: "",
        company: "",
        period: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        year: "",
      },
    ],
    certifications: [] as string[],
    preferences: {
      industryFocus: [] as string[],
      companySize: [] as string[],
      recruitmentFocus: [] as string[],
      specializations: [] as string[],
      workStyle: "",
      languages: [] as string[],
      additionalNotes: "",
    } as HRPreferencesData,
  })

  // Update profile with user data when available
  useEffect(() => {
    if (user) {
      console.log("User data:", user)
      setProfile((prev) => ({
        ...prev,
        name: user.name ? `${user.name} ${user.lastName || ""}`.trim() : prev.name,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
        location: user.location?.city ? `${user.location.city}, ${user.location.country}` : prev.location,
        about: user.bio || prev.about,
        skills: prev.skills,
        preferences: {
          ...prev.preferences,
          industryFocus: user.preferences?.industries || prev.preferences.industryFocus,
          companySize: user.preferences?.companySize || prev.preferences.companySize,
          recruitmentFocus: user.preferences?.recruitmentRoles || prev.preferences.recruitmentFocus,
          // Map the API specialization values directly
          specializations: user.preferences?.specialization || prev.preferences.specializations,
          languages: user.languages || prev.preferences.languages,
        },
      }))
    }
  }, [user])

  const handleCopyProfileLink = () => {
    const profileLink = `${window.location.origin}/profile/${profile.name.toLowerCase().replace(/\s+/g, "-")}`
    navigator.clipboard.writeText(profileLink)
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    })
  }

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    })
  }

  const handleUpdatePreferences = (preferences: HRPreferencesData) => {
    setProfile((prev) => ({
      ...prev,
      preferences,
    }))
  }

  const handleProfileImageChange = (imageUrl: string | null) => {
    setProfile((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }))
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My HR Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyProfileLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Profile Link
          </Button>
          <Link href={`/profile/${profile.name.toLowerCase().replace(/\s+/g, "-")}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

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
                    initialImage={profile.profileImage}
                    name={profile.name}
                    onImageChange={handleProfileImageChange}
                    className="mb-4"
                  />
                ) : (
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.profileImage || ""} alt={profile.name} />
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
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <p className="text-gray-500">{profile.title}</p>
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
                      {profile.linkedin && (
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-gray-500" />
                          <a
                            href={`https://${profile.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.linkedin}
                          </a>
                        </div>
                      )}
                      {profile.twitter && (
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-gray-500" />
                          <a
                            href={`https://${profile.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.twitter}
                          </a>
                        </div>
                      )}
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
                    {profile.experience.map((exp, index) => (
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
                                    newExp[index].title = e.target.value
                                    setProfile({ ...profile, experience: newExp })
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
                                    newExp[index].company = e.target.value
                                    setProfile({ ...profile, experience: newExp })
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`period-${index}`}>Period</Label>
                              <Input
                                id={`period-${index}`}
                                value={exp.period}
                                onChange={(e) => {
                                  const newExp = [...profile.experience]
                                  newExp[index].period = e.target.value
                                  setProfile({ ...profile, experience: newExp })
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
                                  newExp[index].description = e.target.value
                                  setProfile({ ...profile, experience: newExp })
                                }}
                              />
                            </div>
                            {index < profile.experience.length - 1 && <Separator className="my-4" />}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{exp.title || "No title provided"}</h3>
                                <p className="text-gray-500">{exp.company || "No company provided"}</p>
                              </div>
                              <span className="text-sm text-gray-500">{exp.period || "No period provided"}</span>
                            </div>
                            <p>{exp.description || "No description provided"}</p>
                            {index < profile.experience.length - 1 && <Separator className="my-4" />}
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
                            experience: [
                              ...profile.experience,
                              { title: "", company: "", period: "", description: "" },
                            ],
                          })
                        }
                      >
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
                                <Input
                                  id={`year-${index}`}
                                  value={edu.year}
                                  onChange={(e) => {
                                    const newEdu = [...profile.education]
                                    newEdu[index].year = e.target.value
                                    setProfile({ ...profile, education: newEdu })
                                  }}
                                />
                              </div>
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

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (one per line)</Label>
                      <Textarea
                        id="certifications"
                        value={profile.certifications.join("\n")}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            certifications: e.target.value
                              .split("\n")
                              .map((cert) => cert.trim())
                              .filter((cert) => cert),
                          })
                        }
                        placeholder="SHRM-CP
PHR
SPHR"
                      />
                    </div>
                  ) : (
                    <>
                      {profile.certifications.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {profile.certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No certifications added yet.</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
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
                    <Input id="start-time" type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" defaultValue="17:00" />
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
                    defaultValue="America/Los_Angeles"
                  >
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Meeting Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="pref-virtual" defaultChecked />
                    <Label htmlFor="pref-virtual">Available for virtual meetings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pref-in-person" />
                    <Label htmlFor="pref-in-person">Available for in-person meetings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pref-phone" defaultChecked />
                    <Label htmlFor="pref-phone">Available for phone calls</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Availability</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
