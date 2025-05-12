// Base API URL
const API_BASE_URL = "https://hr-service-api-983304911235.europe-west4.run.app/api"

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY: `${API_BASE_URL}/auth/verify`,
  USER: `${API_BASE_URL}/users/me`,
  SET_USERNAME: `${API_BASE_URL}/users/username`,
  GET_USER_BY_USERNAME: `${API_BASE_URL}/users/username/`,
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
