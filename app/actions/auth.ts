"use server"

import { signIn } from "@/auth"

export async function signInWithSpotify() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3000"
  await signIn("spotify", { 
    callbackUrl: `${baseUrl}` 
  })
}

