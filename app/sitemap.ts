import type { MetadataRoute } from "next";

const SITE_URL = "https://innovationconference.com.ng";

interface CourseSlug {
  slug: string;
  updatedAt: string;
}

async function fetchPublishedCourseSlugs(): Promise<CourseSlug[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/courses?limit=1000`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    // Handle both { courses: [] } and plain array responses
    const courses: any[] = Array.isArray(data)
      ? data
      : (data.courses ?? data.data ?? []);
    return courses.map((c: any) => ({
      slug: c.slug,
      updatedAt: c.updatedAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/school`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const courseSlugs = await fetchPublishedCourseSlugs();
  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map(
    ({ slug, updatedAt }) => ({
      url: `${SITE_URL}/courses/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  return [...staticRoutes, ...courseRoutes];
}
