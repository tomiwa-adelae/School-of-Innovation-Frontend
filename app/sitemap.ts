import type { MetadataRoute } from "next";

const SITE_URL = "https://innovationconference.com.ng";

interface CourseSlug {
  slug: string;
  updatedAt: string;
}

async function fetchLiveSessionSlugs(): Promise<CourseSlug[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/live?limit=100`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const sessions: any[] = Array.isArray(data) ? data : (data.sessions ?? []);
    return sessions.map((s: any) => ({
      slug: s.slug,
      updatedAt: s.startsAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
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
      url: `${SITE_URL}/live`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
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
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [courseSlugs, liveSlugs] = await Promise.all([
    fetchPublishedCourseSlugs(),
    fetchLiveSessionSlugs(),
  ]);

  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map(
    ({ slug, updatedAt }) => ({
      url: `${SITE_URL}/courses/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  // Live classes are time-boxed, so they get a daily crawl hint.
  const liveRoutes: MetadataRoute.Sitemap = liveSlugs.map(
    ({ slug, updatedAt }) => ({
      url: `${SITE_URL}/live/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...courseRoutes, ...liveRoutes];
}
