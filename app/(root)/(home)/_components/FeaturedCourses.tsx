"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconUsers,
  IconClock,
  IconBook,
  IconLoader2,
  IconArrowRight,
} from "@tabler/icons-react";
import { publicFetch } from "@/lib/api";

interface PublicCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  thumbnail: string | null;
  level: string;
  pricingType: string;
  price: number | null;
  currency: string | null;
  duration: number;
  category: { id: string; name: string; slug: string } | null;
  instructor: { id: string; firstName: string; lastName: string };
  _count: { chapters: number; enrollments: number };
}

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatPrice(course: PublicCourse) {
  if (course.pricingType === "FREE") return "Free";
  if (course.pricingType === "PAID" && course.price) {
    return `${course.currency ?? "$"}${course.price}`;
  }
  return "Subscription";
}

export const FeaturedCourses = () => {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicFetch<{ courses: PublicCourse[] }>("/public/courses?limit=6")
      .then((data) => setCourses(data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container flex items-center justify-center py-20">
          <IconLoader2
            size={28}
            className="animate-spin text-muted-foreground"
          />
        </div>
      </section>
    );
  }

  if (!courses.length) return null;

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
              Skills for the Future
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Popular at School of Innovation
            </h2>
          </div>
          <Link
            href="/courses"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View all <IconArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="p-0 overflow-hidden group h-full hover:shadow-md transition-shadow">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden bg-gray-100">
                    {course.thumbnail ? (
                      <Image
                        width={400}
                        height={225}
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center bg-gray-200">
                        <IconBook size={32} className="text-gray-400" />
                      </div>
                    )}
                    {course.category && (
                      <Badge className="absolute top-2.5 left-2.5 text-xs">
                        {course.category.name}
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-3 py-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2 hover:text-blue-600 transition-colors flex-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      {course._count.enrollments > 0 && (
                        <span className="flex items-center gap-1">
                          <IconUsers size={12} />
                          {course._count.enrollments.toLocaleString()}
                        </span>
                      )}
                      {formatDuration(course.duration) && (
                        <span className="flex items-center gap-1">
                          <IconClock size={12} />
                          {formatDuration(course.duration)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-sm text-gray-900">
                        {formatPrice(course)}
                      </span>
                      <Button size="sm" className="h-7 text-xs rounded-md px-3">
                        Enroll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View all courses <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
