import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"
import type { HRPreferencesData } from "@/components/hr-preferences"

// Map API specialization values to user-friendly display labels
const specializationLabels: Record<string, string> = {
  Recruiting: "Recruiting",
  "De&I": "Diversity, Equity & Inclusion (DE&I)",
  "HR Ops": "HR Operations & Administration",
  "HR Performance": "Performance Management & Team Development",
  "Compensation & Benefit": "Compensation & Benefits Programs",
}

// This would normally come from a database
const getProfileData = (slug: string) => {
  // In a real app, you would fetch this data based on the slug
  return {
    name: "Sarah Johnson",
    title: "Senior HR Manager",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about:
      "HR professional with 10+ years of experience in talent acquisition, employee relations, and organizational development. Passionate about creating inclusive workplaces and implementing effective HR strategies.",
    linkedin: "linkedin.com/in/sarahjohnson",
    twitter: "twitter.com/sarahjhr",
    profileImage: null as string | null,
    skills: [
      "Talent Acquisition",
      "Employee Relations",
      "Performance Management",
      "Compensation & Benefits",
      "HRIS",
      "Conflict Resolution",
      "Diversity & Inclusion",
      "Training & Development",
    ],
    experience: [
      {
        title: "Senior HR Manager",
        company: "Tech Innovations Inc.",
        period: "2018 - Present",
        description:
          "Lead a team of 5 HR professionals supporting 500+ employees. Implemented new HRIS system reducing administrative tasks by 30%.",
      },
      {
        title: "HR Business Partner",
        company: "Global Solutions Ltd.",
        period: "2014 - 2018",
        description:
          "Provided strategic HR support to executive leadership. Reduced turnover by 15% through improved engagement initiatives.",
      },
      {
        title: "Recruitment Specialist",
        company: "Talent Finders Agency",
        period: "2011 - 2014",
        description:
          "Managed full-cycle recruitment for technology clients. Filled 100+ positions annually with 95% retention rate.",
      },
    ],
    education: [
      {
        degree: "Master's in Human Resources Management",
        institution: "University of California",
        year: "2011",
      },
      {
        degree: "Bachelor's in Business Administration",
        institution: "State University",
        year: "2009",
      },
    ],
    certifications: [
      "SHRM Senior Certified Professional (SHRM-SCP)",
      "Professional in Human Resources (PHR)",
      "Certified Diversity Professional (CDP)",
    ],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "9:00 AM - 5:00 PM",
      timezone: "Pacific Time (US & Canada)",
      preferences: ["Virtual meetings", "Phone calls"],
    },
    preferences: {
      industryFocus: ["Technology", "Healthcare", "Finance"],
      companySize: ["Medium Businesses (50-500 employees)", "Series C-D Startups (50-500 employees)"],
      recruitmentFocus: ["Tech & IT roles", "Engineering", "Product"],
      specializations: ["Recruiting", "HR Ops", "Compensation & Benefit"],
      workStyle: "strategic",
      languages: ["English 🇬🇧", "Spanish 🇪🇸", "French 🇫🇷"],
      additionalNotes:
        "Particularly interested in companies with a strong focus on employee development and innovative HR practices. Experienced in implementing data-driven HR strategies and building scalable talent acquisition processes.",
    } as HRPreferencesData,
  }
}

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const profile = getProfileData(params.slug)

  // Helper function to get readable work style
  const getWorkStyleLabel = (style: string) => {
    switch (style) {
      case "strategic":
        return "Strategic (focus on long-term planning)"
      case "operational":
        return "Operational (focus on day-to-day execution)"
      case "consultative":
        return "Consultative (advisory approach)"
      case "hands-on":
        return "Hands-on (direct involvement)"
      case "collaborative":
        return "Collaborative (team-oriented)"
      case "independent":
        return "Independent (self-directed)"
      default:
        return style
    }
  }

  // Helper function to get user-friendly specialization label
  const getSpecializationLabel = (specialization: string) => {
    return specializationLabels[specialization] || specialization
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profileImage || ""} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl">{profile.name}</CardTitle>
              <CardDescription className="text-lg">{profile.title}</CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 4 && <Badge variant="outline">+{profile.skills.length - 4} more</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p>{profile.about}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">HR Specialization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Industry Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.industryFocus.map((industry) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Company Size Preference</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.companySize.map((size) => (
                        <Badge key={size} variant="outline">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Recruitment Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.recruitmentFocus.map((focus) => (
                        <Badge key={focus} variant="outline">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Work Style</h4>
                    <p>{getWorkStyleLabel(profile.preferences.workStyle)}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.languages.map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-gray-500">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500">{exp.period}</span>
                      </div>
                      <p className="text-sm mt-1">{exp.description}</p>
                      {index < profile.experience.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                <div className="space-y-3">
                  {profile.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-gray-500">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-500">{edu.year}</span>
                      </div>
                      {index < profile.education.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {profile.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      href={`https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.linkedin}
                    </a>
                  </div>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Days</h4>
                    <p>{profile.availability.days.join(", ")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Hours</h4>
                    <p>{profile.availability.hours}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Time Zone</h4>
                    <p>{profile.availability.timezone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Meeting Preferences</h4>
                    <p>{profile.availability.preferences.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">HR Specializations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {getSpecializationLabel(spec)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center mt-4">
                <Button variant="outline" asChild>
                  <Link href={`mailto:${profile.email}`}>Contact {profile.name.split(" ")[0]}</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
