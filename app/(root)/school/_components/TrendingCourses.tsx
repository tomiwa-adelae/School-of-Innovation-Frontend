import React from "react";
import {
  IconClock,
  IconChartBar,
  IconUsers,
  IconBookmark,
  IconStar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const TrendingCourses = () => {
  const featuredCourses = [
    {
      title: "MERN Stack Mastery",
      instructor: "Tomiwa Adelae",
      price: "FREE",
      originalPrice: "₦45,000",
      students: "1.2k",
      duration: "12 Weeks",
      level: "Intermediate",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
    },
    {
      title: "Arduino for Beginners",
      instructor: "Shade Akinteye",
      price: "₦15,000",
      originalPrice: "₦25,000",
      students: "850",
      duration: "8 Weeks",
      level: "Beginner",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80",
    },
    {
      title: "UI/UX Design Systems",
      instructor: "Iranwo A. Opadoja",
      price: "FREE",
      originalPrice: "₦35,000",
      students: "2.1k",
      duration: "10 Weeks",
      level: "All Levels",
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-primary text-sm mb-4">Most Enrolled</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900">
            Trending <span className="text-gray-400">Knowledge.</span>
          </h3>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {featuredCourses.map((course, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              {/* Image & Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-gray-900 shadow-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
                  <IconBookmark size={20} />
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1 text-orange-400">
                    <IconStar size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-900">
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <IconUsers size={16} />
                    <span>{course.students}</span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h4>
                <p className="text-gray-500 text-sm mb-2">
                  by {course.instructor}
                </p>

                <Separator className="my-4" />

                {/* Course Metadata */}
                <div className="flex items-center gap-6 mb-4 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconClock size={18} />
                    <span className="text-xs">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconChartBar size={18} />
                    <span className="text-xs">Labs Included</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {course.price}
                    </p>
                    <p className="text-xs text-muted-foreground line-through font-bold">
                      {course.originalPrice}
                    </p>
                  </div>
                  <Button>View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Button asChild variant={"link"}>
            <Link href="/courses">
              Browse our catalog of 50+ specialized tracks
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
