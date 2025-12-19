import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      // Explicitly provide the Spotify authorization URL + scopes so Auth.js
      // can construct a valid URL for the OAuth flow.
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: [
            "streaming",
            "user-read-email",
            "user-read-private",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-library-read",
            "playlist-read-private",
            "playlist-read-collaborative",
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      
      // Handle token refresh if expired (basic implementation)
      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        // Token expired, try to refresh
        try {
          const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
              ).toString("base64")}`,
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          })

          if (response.ok) {
            const refreshedTokens = await response.json()
            token.accessToken = refreshedTokens.access_token
            token.expiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in
            
            if (refreshedTokens.refresh_token) {
              token.refreshToken = refreshedTokens.refresh_token
            }
          }
        } catch (error) {
          console.error("Error refreshing token:", error)
          // Token refresh failed, clear token to force re-auth
          token.accessToken = null
          token.refreshToken = null
        }
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string | null
      session.refreshToken = token.refreshToken as string | null
      return session
    },
  },
  pages: {
    signIn: "/",
  },
})

