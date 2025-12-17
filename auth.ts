import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Required for NextAuth v5 to work properly
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "streaming",
            "user-read-email",
            "user-read-private",
            "user-read-playback-state",
            "user-modify-playback-state",
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

