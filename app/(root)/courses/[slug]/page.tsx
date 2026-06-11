import type { Metadata } from "next";
import CourseDetailClient from "./_components/CourseDetailClient";

interface CourseMetaShape {
  title: string;
  shortDescription: string | null;
  description: string | null;
  thumbnail: string | null;
  tags: string[];
  level: string;
  language: string;
  category: { name: string } | null;
  instructor: { firstName: string; lastName: string };
  _count: { enrollments: number };
}

async function fetchCourseMeta(slug: string): Promise<CourseMetaShape | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/courses/${slug}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourseMeta(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "This course could not be found on School of Innovation.",
    };
  }

  const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
  const description =
    course.shortDescription ||
    course.description?.slice(0, 160) ||
    `Learn ${course.title} with ${instructorName} on School of Innovation. ${course._count.enrollments} students enrolled.`;

  const keywords = [
    course.title,
    `${course.title} course`,
    course.category?.name ?? "",
    course.level,
    instructorName,
    "online course Nigeria",
    "School of Innovation",
    ...course.tags,
  ].filter(Boolean);

  const url = `https://innovationconference.com.ng/courses/${slug}`;

  return {
    title: course.title,
    description,
    keywords,
    openGraph: {
      type: "article",
      title: `${course.title} | School of Innovation`,
      description,
      url,
      images: course.thumbnail
        ? [
            {
              url: course.thumbnail,
              width: 1280,
              height: 720,
              alt: course.title,
            },
          ]
        : [
            {
              url: "/assets/images/soi-logo.png",
              width: 1200,
              height: 630,
              alt: course.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | School of Innovation`,
      description,
      images: course.thumbnail
        ? [course.thumbnail]
        : ["/assets/images/soi-logo.png"],
    },
    alternates: { canonical: url },
  };
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
