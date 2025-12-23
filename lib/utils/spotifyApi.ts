/**
 * Modern Spotify API client with automatic token refresh
 * Handles 401 errors by refreshing tokens automatically
 */

export interface ApiError {
  status: number
  message: string
  error?: any
}

export class SpotifyApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: any
  ) {
    super(message)
    this.name = "SpotifyApiError"
  }
}

/**
 * Refresh the access token by triggering a session update
 * NextAuth will automatically refresh the token in the JWT callback
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    // Trigger session update which will refresh the token server-side
    const response = await fetch("/api/auth/session", {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to refresh session")
      return null
    }

    const session = await response.json()
    return session?.accessToken || null
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

/**
 * Make a Spotify API request with automatic token refresh on 401
 */
export async function spotifyFetch(
  url: string,
  options: RequestInit = {},
  accessToken: string | null,
  onTokenUpdate?: (newToken: string) => void
): Promise<Response> {
  if (!accessToken) {
    throw new SpotifyApiError(401, "No access token available")
  }

  const makeRequest = async (token: string): Promise<Response> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    // If 401, try to refresh token and retry once
    if (response.status === 401) {
      console.log("Token expired, attempting refresh...")
      const newToken = await refreshAccessToken()
      
      if (newToken && onTokenUpdate) {
        onTokenUpdate(newToken)
        
        // Retry the request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        })
      }
      
      throw new SpotifyApiError(401, "Authentication failed. Please reconnect to Spotify.")
    }

    return response
  }

  return makeRequest(accessToken)
}

/**
 * Get JSON response with error handling
 */
export async function spotifyFetchJson<T>(
  url: string,
  options: RequestInit = {},
  accessToken: string | null,
  onTokenUpdate?: (newToken: string) => void
): Promise<T> {
  const response = await spotifyFetch(url, options, accessToken, onTokenUpdate)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new SpotifyApiError(
      response.status,
      errorData.error?.message || `Request failed with status ${response.status}`,
      errorData
    )
  }

  return response.json()
}

