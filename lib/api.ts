// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY: `${API_BASE_URL}/auth/verify`,
  USER: `${API_BASE_URL}/users/me`,
  SET_USERNAME: `${API_BASE_URL}/users/username`,
  GET_USER_BY_USERNAME: `${API_BASE_URL}/users/username/`,
  PROFILE_PICTURE_UPLOAD_URL: `${API_BASE_URL}/profile-pictures/upload-url`,
  PROFILE_PICTURE_CONFIRM: `${API_BASE_URL}/profile-pictures/confirm`,
  PROFILE_PICTURE_DELETE: `${API_BASE_URL}/profile-pictures`,
}

// Track if verification is in progress
let verificationInProgress = false

// Login with email
export async function loginWithEmail(email: string): Promise<{ message: string }> {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to send verification email")
  }

  return response.json()
}

// Verify token with protection against multiple calls
export async function verifyToken(token: string): Promise<{ token: string; message: string }> {
  // If verification is already in progress, throw an error
  if (verificationInProgress) {
    throw new Error("Verification already in progress")
  }

  try {
    // Set flag to prevent multiple simultaneous verifications
    verificationInProgress = true

    console.log("Sending verification request...")
    const response = await fetch(`${API_ENDPOINTS.VERIFY}?token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Invalid or expired verification token")
    }

    return data
  } catch (error) {
    console.error("Token verification error:", error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("Failed to verify token. Please try again or request a new verification link.")
    }
  } finally {
    // Reset flag after verification completes (success or failure)
    verificationInProgress = false
  }
}

// Get user details
export async function getUserDetails(token: string): Promise<any> {
  const response = await fetch(API_ENDPOINTS.USER, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch user details")
  }

  return response.json()
}

// Set username
export async function setUsername(token: string, username: string): Promise<{ username: string }> {
  const response = await fetch(API_ENDPOINTS.SET_USERNAME, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to set username")
  }

  return data
}

// Get user by username (public)
export async function getUserByUsername(username: string): Promise<any> {
  const response = await fetch(`${API_ENDPOINTS.GET_USER_BY_USERNAME}${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch user details")
  }

  return response.json()
}

// Update user profile
export async function updateUserProfile(token: string, profileData: any): Promise<any> {
  console.log("Updating profile with data:", JSON.stringify(profileData, null, 2))

  const response = await fetch(API_ENDPOINTS.USER, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("API error response:", data)
    throw new Error(data.message || "Failed to update profile")
  }

  console.log("Profile updated successfully:", data)
  return data
}

// Get a signed URL for profile picture upload
export async function getProfilePictureUploadUrl(
  token: string,
  contentType: string,
  fileExtension: string,
): Promise<{ signedUrl: string; filePath: string; publicUrl: string }> {
  const response = await fetch(API_ENDPOINTS.PROFILE_PICTURE_UPLOAD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contentType,
      fileExtension,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to get upload URL")
  }

  return data
}

// Upload profile picture to the signed URL
export async function uploadProfilePicture(signedUrl: string, file: File, contentType: string): Promise<void> {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error("Failed to upload profile picture")
  }
}

// Confirm profile picture upload
export async function confirmProfilePictureUpload(token: string, filePath: string, contentType: string): Promise<any> {
  const response = await fetch(API_ENDPOINTS.PROFILE_PICTURE_CONFIRM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      filePath,
      contentType,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to confirm profile picture upload")
  }

  return data
}

// Delete profile picture
export async function deleteProfilePicture(token: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.PROFILE_PICTURE_DELETE, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    // For 204 No Content, there's no JSON to parse
    if (response.status !== 204) {
      const error = await response.json().catch(() => ({ message: "Failed to delete profile picture" }))
      throw new Error(error.message || "Failed to delete profile picture")
    }
  }
}
