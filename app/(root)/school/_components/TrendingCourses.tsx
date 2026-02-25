import React from "react";
import {
  IconClock,
  IconChartBar,
  IconUsers,
  IconBookmark,
  IconStar,
} from "@tabler/icons-react";

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
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
            Most Enrolled
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900">
            Trending <span className="text-gray-400">Knowledge.</span>
          </h3>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredCourses.map((course, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
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

                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h4>
                <p className="text-gray-500 text-sm mb-6">
                  by {course.instructor}
                </p>

                {/* Course Metadata */}
                <div className="flex items-center gap-6 mb-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconClock size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconChartBar size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Labs Included
                    </span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-blue-600">
                      {course.price}
                    </p>
                    <p className="text-xs text-gray-400 line-through font-bold">
                      {course.originalPrice}
                    </p>
                  </div>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="text-gray-400 font-bold border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 transition-all pb-1">
            Browse our catalog of 50+ specialized tracks
          </button>
        </div>
      </div>
    </section>
  );
};
