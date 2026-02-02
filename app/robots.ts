import { MetadataRoute } from "next"

const baseUrl = process.env.NEXTAUTH_URL || "https://sukuna.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
