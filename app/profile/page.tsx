"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  HRPreferences,
  type HRPreferencesData,
} from "@/components/hr-preferences";
import { ProfileImageUpload } from "@/components/profile-image-upload";
import { useAuth } from "@/contexts/auth-context";
import { UsernameCreationModal } from "@/components/username-creation-modal";
import {
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Loader2,
  Clock,
  Calendar,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { updateUserProfile } from "@/lib/api";
import { FreelancerTypeSelector } from "@/components/freelancer-type-selector";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameRedirectPath, setUsernameRedirectPath] = useState<
    string | undefined
  >();
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    monday: false,
    tuesday: false,
    wednessday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [timezone, setTimezone] = useState<string>("Europe/Paris");
  const [skillsInput, setSkillsInput] = useState<string>("");
  const [freelancerTypes, setFreelancerTypes] = useState<
    Array<{
      id: string;
      values: string[];
      experience?: number;
    }>
  >([]);

  // Update the profile state initialization to include profileImage
  const [profile, setProfile] = useState({
    name: "",
    title: "",
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
      uploadedAt: "",
    },
    skills: [] as string[],
    type: [] as Array<{
      id: string;
      values: string[];
      experience?: number;
    }>,
    preferences: {
      industryFocus: [] as string[],
      companySize: [] as string[],
      projectLifeSpan: [] as string[],
      workStyle: "",
      setupType: "",
      languages: [] as string[],
      additionalNotes: "",
    } as HRPreferencesData,
    monthlyBudget: 0,
    hourlyBudget: 0,
    issuingInvoice: "",
  });

  // Helper function to parse date string to Date object
  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Handle MM/YYYY format
    const parts = dateStr.split("/");
    if (parts.length === 2) {
      const month = Number.parseInt(parts[0], 10) - 1; // JS months are 0-indexed
      const year = Number.parseInt(parts[1], 10);
      if (!isNaN(month) && !isNaN(year)) {
        return new Date(year, month, 1);
      }
    }

    return null;
  };

  // Helper function to format Date to string
  const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    return format(date, "MM/yyyy");
  };

  // Update the useEffect that loads user data to handle the new profilePicture structure
  useEffect(() => {
    if (user) {
      setProfile((prev) => {
        const updatedProfile = {
          ...prev,
          name: user.name
            ? `${user.name} ${user.lastName || ""}`.trim()
            : prev.name,
          email: user.email || prev.email,
          phone: user.phoneNumber || prev.phone,
          location: user.location?.city
            ? `${user.location.city}, ${user.location.country}`
            : prev.location,
          about: user.bio || prev.about,
          linkedin: user.linkedin,
          twitter: user.twitter,
          profileImage: user.profilePicture,
          skills: user.skills || prev.skills,
          type: user.type || prev.type,
          monthlyBudget: user.monthlyBudget || prev.monthlyBudget,
          hourlyBudget: user.hourlyBudget || prev.hourlyBudget,
          issuingInvoice: user.issuingInvoice || prev.issuingInvoice,
          preferences: {
            ...prev.preferences,
            industryFocus:
              user.preferences?.industries || prev.preferences.industryFocus,
            companySize:
              user.preferences?.companySize || prev.preferences.companySize,
            projectLifeSpan:
              user.preferences?.projectLifeSpan ||
              prev.preferences.projectLifeSpan,
            setupType:
              user.preferences?.setupType || prev.preferences.setupType,
            workStyle:
              user.preferences?.workStyle || prev.preferences.workStyle,
            languages: user.languages || prev.preferences.languages,
          },
        };

        // Set the skills input and freelancer types when user data loads
        setSkillsInput((user.skills || []).join(", "));
        setFreelancerTypes(user.type || []);

        return updatedProfile;
      });
    }
  }, [user]);

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
        };

        // Convert days to lowercase for case-insensitive matching
        user.availability.days.forEach((day: string) => {
          const dayLower = day.toLowerCase();
          if (dayLower in newAvailability) {
            newAvailability[dayLower] = true;
          }
        });

        setAvailability(newAvailability);
      }

      // Update working hours
      if (user.availability.startTime) {
        setStartTime(user.availability.startTime);
      }

      if (user.availability.endTime) {
        setEndTime(user.availability.endTime);
      }

      // Update timezone if available, otherwise use Europe/Paris as default
      setTimezone(user.availability.timeZone || "Europe/Paris");
    }
  }, [user]);

  // Update the handleCopyProfileLink function to use username consistently
  const handleCopyProfileLink = () => {
    // Check if user has a username
    if (!user?.username) {
      setUsernameRedirectPath("copy");
      setShowUsernameModal(true);
      return;
    }

    const profileLink = `${window.location.origin}/view/${user.username}`;
    navigator.clipboard.writeText(profileLink);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    });
  };

  const handleViewPublicProfile = () => {
    // Check if user has a username
    if (!user?.username) {
      setUsernameRedirectPath("view");
      setShowUsernameModal(true);
      return;
    }

    // If they do have a username, open the public profile
    window.open(`/view/${user.username}`, "_blank");
  };

  const handleUsernameCreated = (username: string) => {
    setShowUsernameModal(false);

    // Handle the action based on the redirect path
    if (usernameRedirectPath === "copy") {
      const profileLink = `${window.location.origin}/view/${username}`;
      navigator.clipboard.writeText(profileLink);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      });
    } else if (usernameRedirectPath === "view") {
      window.open(`/view/${username}`, "_blank");
    }

    setUsernameRedirectPath(undefined);
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Update the prepareProfileData function to not include profileImage
  // (since it's now handled separately through the profile picture upload API)
  const prepareProfileData = () => {
    // Split name into first and last name
    const nameParts = profile.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Parse location into city and country
    let city = null;
    let country = null;
    if (profile.location) {
      const locationParts = profile.location.split(",");
      city = locationParts[0]?.trim() || null;
      country = locationParts[1]?.trim() || null;
    }

    // Format availability data
    const selectedDays = Object.entries(availability)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day.toLowerCase());

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
      type: freelancerTypes,
      availability: {
        days: selectedDays,
        startTime: startTime, // Use 24-hour format directly
        endTime: endTime, // Use 24-hour format directly
        timeZone: timezone,
      },
      location: {
        country: country,
        city: city,
        type: profile.preferences.setupType || "Remote",
      },
      setupType: profile.preferences.setupType || "Remote",
      languages: profile.preferences.languages || [],
      monthlyBudget: profile.monthlyBudget,
      hourlyBudget: profile.hourlyBudget,
      issuingInvoice: profile.issuingInvoice,
      yearsOfExperience: 0,
      preferences: {
        companySize: profile.preferences.companySize || [],
        industries: profile.preferences.industryFocus || [],
        projectLifeSpan:
          profile.preferences.projectLifeSpan.length > 0
            ? profile.preferences.projectLifeSpan
            : ["Long-term projects (more than 2 months)"],
      },
      cv: [],
      experience: [],
      education: [],
      skills: profile.skills || [],
      payment: {
        organizationType: profile.issuingInvoice, // Default value
      },
    };
  };

  const handleSaveProfile = async () => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your profile",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare the data for the API according to the required schema
      const profileData = prepareProfileData();

      // Send the data to the API
      const updatedUser = await updateUserProfile(token, profileData);

      // Update the user context with the new data
      updateUser(updatedUser);

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully saved",
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = (preferences: HRPreferencesData) => {
    setProfile((prev) => ({
      ...prev,
      preferences,
    }));
  };

  const handleProfileImageChange = (image: {
    filePath: string;
    publicUrl: string;
    contentType: string;
    uploadedAt: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      profileImage: image,
    }));
  };


  const handleSaveAvailability = async () => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your availability",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get selected days as an array of lowercase day names
      const selectedDays = Object.entries(availability)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day.toLowerCase());

      // Prepare availability data according to the API schema
      const availabilityData = {
        ...prepareProfileData(),
        availability: {
          days: selectedDays,
          startTime: startTime, // Use 24-hour format directly
          endTime: endTime, // Use 24-hour format directly
          timeZone: timezone,
        },
      };

      // Send only the availability data to the API
      const updatedUser = await updateUserProfile(token, availabilityData);

      // Update the user context with the new data
      updateUser(updatedUser);

      toast({
        title: "Availability saved",
        description: "Your availability settings have been updated.",
      });
    } catch (error) {
      console.error("Failed to save availability:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get day display name
  const getDayDisplayName = (day: string) => {
    const dayNames = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednessday: "Wednesday", // Note: keeping the typo from original state
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    };
    return dayNames[day as keyof typeof dayNames] || day;
  };

  // Helper function to get selected days count
  const getSelectedDaysCount = () => {
    return Object.values(availability).filter(Boolean).length;
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {!user?.username && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Username Required</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Please create a username. This will be used when sharing your
            profile with companies
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

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Project Preferences</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Info</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(true);
                        setSkillsInput(profile.skills.join(", "));
                      }}
                    >
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
                    <AvatarImage
                      src={profile.profileImage.publicUrl || ""}
                      alt={profile.name}
                    />
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
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) =>
                          setProfile({ ...profile, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        disabled={true}
                        className="bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profile.linkedin || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, linkedin: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <p className="text-gray-500">{profile.title}</p>
                      {user?.username && (
                        <p className="text-sm text-gray-400 mt-1">
                          @{user.username}
                        </p>
                      )}
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
                      onChange={(e) =>
                        setProfile({ ...profile, about: e.target.value })
                      }
                      className="min-h-[120px]"
                      placeholder="Write a brief description about yourself, your experience, and your HR expertise..."
                    />
                  ) : (
                    <div className="text-gray-700 leading-relaxed space-y-3">
                      {profile.about
                        .split("\n")
                        .map((paragraph, index) => {
                          // Skip empty paragraphs
                          if (paragraph.trim() === "") return null;

                          return (
                            <p key={index} className="text-gray-700">
                              {paragraph}
                            </p>
                          );
                        })
                        .filter(Boolean) || "No bio information provided yet."}
                    </div>
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
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onBlur={() => {
                          // Process skills when user finishes editing
                          const skillsArray = skillsInput
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter((skill) => skill.length > 0);
                          setProfile({ ...profile, skills: skillsArray });
                        }}
                        placeholder="Performance Management, Employee Relations, Talent Acquisition, etc."
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500">
                        Separate skills with commas. Skills will be processed
                        when you click outside the field.
                      </p>
                      {/* Show preview of processed skills */}
                      {skillsInput && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Preview:</p>
                          <div className="flex flex-wrap gap-1">
                            {skillsInput
                              .split(",")
                              .map((skill) => skill.trim())
                              .filter((skill) => skill.length > 0)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
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
                  <CardTitle>Freelancer Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerTypeSelector
                    freelancerTypes={freelancerTypes}
                    onChange={setFreelancerTypes}
                    readOnly={!isEditing}
                  />
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
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
          <HRPreferences
            preferences={profile.preferences}
            onUpdate={handleUpdatePreferences}
          />
        </TabsContent>
        <TabsContent value="availability">
          <div className="space-y-6">
            {/* Availability Overview Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-900">
                      Set Your Availability
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      Let clients know when you're available to work with them
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{getSelectedDaysCount()} days selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{timezone.replace(/_/g, " ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Availability Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <CardTitle>Weekly Availability</CardTitle>
                  </div>
                  <CardDescription>
                    Select the days you're available for client work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(availability).map(([day, isAvailable]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                      >
                        <Label
                          htmlFor={`day-${day}`}
                          className="font-medium cursor-pointer flex-1"
                        >
                          {getDayDisplayName(day)}
                        </Label>
                        <Switch
                          id={`day-${day}`}
                          checked={isAvailable}
                          onCheckedChange={() => toggleDay(day)}
                          className="ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours & Timezone Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <CardTitle>Working Hours</CardTitle>
                    </div>
                    <CardDescription>
                      Set your working hours for client projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="start-time"
                          className="text-sm font-medium"
                        >
                          Start Time
                        </Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="end-time"
                          className="text-sm font-medium"
                        >
                          End Time
                        </Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <CardTitle>Time Zone</CardTitle>
                    </div>
                    <CardDescription>
                      Your local time zone for scheduling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm font-medium">
                        Select Your Time Zone
                      </Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      >
                        {/* Americas */}
                        <optgroup label="Americas">
                          <option value="America/Los_Angeles">
                            Pacific Time (US & Canada)
                          </option>
                          <option value="America/Denver">
                            Mountain Time (US & Canada)
                          </option>
                          <option value="America/Chicago">
                            Central Time (US & Canada)
                          </option>
                          <option value="America/New_York">
                            Eastern Time (US & Canada)
                          </option>
                          <option value="America/Sao_Paulo">
                            São Paulo (Brazil)
                          </option>
                          <option value="America/Argentina/Buenos_Aires">
                            Buenos Aires (Argentina)
                          </option>
                        </optgroup>

                        {/* Europe & Africa */}
                        <optgroup label="Europe & Africa">
                          <option value="Europe/London">London (UK)</option>
                          <option value="Europe/Paris">
                            Central European Time (Paris, Berlin)
                          </option>
                          <option value="Europe/Helsinki">
                            Eastern European Time (Helsinki, Athens)
                          </option>
                          <option value="Europe/Moscow">Moscow (Russia)</option>
                          <option value="Africa/Cairo">Cairo (Egypt)</option>
                          <option value="Africa/Johannesburg">
                            Johannesburg (South Africa)
                          </option>
                          <option value="Africa/Lagos">Lagos (Nigeria)</option>
                          <option value="Africa/Nairobi">
                            Nairobi (Kenya)
                          </option>
                        </optgroup>

                        {/* Asia & Oceania */}
                        <optgroup label="Asia & Oceania">
                          <option value="Asia/Dubai">Dubai (UAE)</option>
                          <option value="Asia/Kolkata">
                            Mumbai, New Delhi (India)
                          </option>
                          <option value="Asia/Bangkok">
                            Bangkok (Thailand)
                          </option>
                          <option value="Asia/Singapore">Singapore</option>
                          <option value="Asia/Shanghai">
                            Beijing, Shanghai (China)
                          </option>
                          <option value="Asia/Tokyo">Tokyo (Japan)</option>
                          <option value="Asia/Seoul">
                            Seoul (South Korea)
                          </option>
                          <option value="Australia/Sydney">
                            Sydney (Australia)
                          </option>
                          <option value="Pacific/Auckland">
                            Auckland (New Zealand)
                          </option>
                        </optgroup>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveAvailability}
                disabled={isSaving}
                size="lg"
                className="px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Save Availability
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure your budget preferences and organization type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly-budget">Monthly Budget (€)</Label>
                  <Input
                    id="monthly-budget"
                    type="number"
                    min="0"
                    step="100"
                    value={profile.monthlyBudget}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        monthlyBudget: Number(e.target.value),
                      })
                    }
                    placeholder="Enter monthly budget"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly-budget">Hourly Budget (€)</Label>
                  <Input
                    id="hourly-budget"
                    type="number"
                    min="0"
                    step="5"
                    value={profile.hourlyBudget}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        hourlyBudget: Number(e.target.value),
                      })
                    }
                    placeholder="Enter hourly budget"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization-type">Organization Type</Label>
                <Select
                  value={profile.issuingInvoice}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      issuingInvoice: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Small Recruiting Agency (1-10 employees)">
                      Small Recruiting Agency (1-10 employees)
                    </SelectItem>
                    <SelectItem value="Medium Recruiting Agency (10-50 employees)">
                      Medium Recruiting Agency (10-50 employees)
                    </SelectItem>
                    <SelectItem value="Large recruiting Agency +50 employees">
                      Large recruiting Agency +50 employees
                    </SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="As a freelance">
                      As a freelance
                    </SelectItem>
                    <SelectItem value="As a company">As a company</SelectItem>
                    <SelectItem value="Employee contract">
                      Employee contract
                    </SelectItem>
                    <SelectItem value="As a company,Employee contract">
                      As a company,Employee contract
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>{" "}
      </Tabs>

      {/* Username Creation Modal */}
      <UsernameCreationModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSuccess={handleUsernameCreated}
        redirectPath={usernameRedirectPath}
      />
    </div>
  );
}
