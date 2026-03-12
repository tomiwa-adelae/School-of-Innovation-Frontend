"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { publicFetch } from "@/lib/api";
import { fetchData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  IconSearch,
  IconBook,
  IconClock,
  IconUsers,
  IconLoader2,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { cn, formatMoneyInput } from "@/lib/utils";
import { NairaIcon } from "@/components/NairaIcon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "ALL_LEVELS", label: "All Levels Course" },
];

const PRICING = [
  { value: "", label: "Any Price" },
  { value: "FREE", label: "Free" },
  { value: "PAID", label: "Paid" },
];

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

function CourseCard({ course }: { course: PublicCourse }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {course.thumbnail ? (
            <Image
              width={400}
              height={225}
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center">
              <IconBook size={32} className="text-gray-400" />
            </div>
          )}
          {course.category && (
            <Badge className="absolute top-2 left-2 text-xs">
              {course.category.name}
            </Badge>
          )}
          {course.pricingType === "FREE" && (
            <Badge className="absolute top-2 right-2 text-xs bg-green-600 hover:bg-green-600">
              Free
            </Badge>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors flex-1">
            {course.title}
          </h3>
          {course.shortDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {course.shortDescription}
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-3">
            {course.instructor.firstName} {course.instructor.lastName}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {course._count.enrollments > 0 && (
              <span className="flex items-center gap-1">
                <IconUsers size={11} />
                {course._count.enrollments.toLocaleString()} students
              </span>
            )}
            {formatDuration(course.duration) && (
              <span className="flex items-center gap-1">
                <IconClock size={11} />
                {formatDuration(course.duration)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-gray-800">
            <span className="font-black text-gray-900 dark:text-white text-sm">
              <NairaIcon />
              {formatMoneyInput(course?.price!)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {course.level.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    fetchData<Category[]>("/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedPricing) params.set("pricingType", selectedPricing);
    params.set("limit", "24");

    publicFetch<{ courses: PublicCourse[]; total: number }>(
      `/public/courses?${params.toString()}`,
    )
      .then((data) => {
        setCourses(data.courses);
        setTotal(data.total);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedCategory, selectedLevel, selectedPricing]);

  const hasFilters =
    !!selectedCategory ||
    !!selectedLevel ||
    !!selectedPricing ||
    !!debouncedSearch;

  function clearFilters() {
    setSearch("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedPricing("");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container py-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Browse Courses
          </h1>
          <p className="text-muted-foreground">
            {total > 0
              ? `${total} course${total !== 1 ? "s" : ""} available`
              : "Discover courses to accelerate your skills"}
          </p>

          {/* Search bar */}
          <div className="relative mt-5 max-w-xl">
            <InputGroup>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0 hidden md:block">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm flex items-center gap-1.5">
                  <IconFilter size={15} /> Filters
                </h2>
                {hasFilters && (
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    onClick={clearFilters}
                    className="hover:underline text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Category
                  </p>
                  <div className="space-y-1">
                    <Button
                      size={"sm"}
                      variant={!selectedCategory ? "default" : "secondary"}
                      onClick={() => setSelectedCategory("")}
                      className={"justify-start w-full"}
                    >
                      All Categories
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        size={"sm"}
                        variant={selectedCategory ? "default" : "secondary"}
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={"w-full justify-start text-xs"}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Level */}
              <div className="mb-5">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Level
                </p>
                <div className="space-y-1">
                  {LEVELS.map(({ value, label }) => (
                    <Button
                      size={"sm"}
                      key={value}
                      variant={
                        selectedLevel === value ? "default" : "secondary"
                      }
                      onClick={() => setSelectedLevel(value)}
                      className={"w-full justify-start text-xs"}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Price
                </p>
                <div className="space-y-1">
                  {PRICING.map(({ value, label }) => (
                    <Button
                      size={"sm"}
                      key={value}
                      onClick={() => setSelectedPricing(value)}
                      className={"w-full justify-start text-xs"}
                      variant={
                        selectedPricing === value ? "default" : "secondary"
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16 md:py-24">
                <IconLoader2
                  size={28}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 md:py-24 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconBook size={28} className="text-muted-foreground" />
                </div>
                <p className="font-black text-gray-900 dark:text-white text-lg mb-1">
                  No courses found
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {hasFilters
                    ? "Try adjusting your filters or search term."
                    : "No published courses yet. Check back soon!"}
                </p>
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="rounded-xl"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
