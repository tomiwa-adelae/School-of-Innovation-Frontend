import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/courses/", "/about", "/contact", "/conference"],
        disallow: [
          "/dashboard",
          "/settings",
          "/learn/",
          "/a/",
          "/onboarding",
          "/forgot-password",
          "/verify-code",
          "/set-new-password",
        ],
      },
    ],
    sitemap: "https://innovationconference.com.ng/sitemap.xml",
  };
}
