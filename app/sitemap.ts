import { MetadataRoute } from "next"

const baseUrl = process.env.NEXTAUTH_URL || "https://sukuna.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
