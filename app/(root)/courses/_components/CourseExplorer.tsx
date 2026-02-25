import React from "react";
import {
  IconFilter,
  IconClock,
  IconStar,
  IconUsers,
  IconPointFilled,
  IconChevronDown,
} from "@tabler/icons-react";

export const CourseExplorer = () => {
  const categories = [
    "All Courses",
    "Web Development",
    "Robotics & IoT",
    "Digital Marketing",
    "UI/UX Design",
    "Business Strategy",
  ];

  const courses = [
    {
      title: "MERN Stack for Beginners",
      category: "Web Development",
      price: "FREE",
      rating: 4.9,
      students: "1.2k",
      duration: "12 Weeks",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
    },
    {
      title: "Arduino & Embedded Systems",
      category: "Robotics & IoT",
      price: "₦15,000",
      rating: 4.8,
      students: "850",
      duration: "8 Weeks",
      image:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80",
    },
    {
      title: "Advanced Brand Strategy",
      category: "Business Strategy",
      price: "₦25,000",
      rating: 5.0,
      students: "600",
      duration: "6 Weeks",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
    },
    // ... add more as needed
  ];

  return (
    <section className="pb-24 bg-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 space-y-8">
            <div>
              <h4 className="flex items-center gap-2 font-black text-gray-900 uppercase tracking-widest text-xs mb-6">
                <IconFilter size={16} />
                Filter by Category
              </h4>
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between
                      ${i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                  >
                    {cat}
                    {i === 0 && <IconPointFilled size={12} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm mb-4">
                Price Range
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Free Courses
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Paid Tracks
                </label>
              </div>
            </div>
          </aside>

          {/* Main Course Grid */}
          <div className="lg:w-3/4">
            {/* Sort & Results Count */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <p className="text-gray-500 font-medium text-sm">
                Showing <span className="text-gray-900 font-bold">12</span>{" "}
                courses
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-gray-900">
                Sort by: <span className="text-blue-600">Newest</span>
                <IconChevronDown size={16} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black text-blue-600 uppercase">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <IconClock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconUsers size={16} />
                        <span>{course.students}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <IconStar
                          size={16}
                          className="text-orange-400"
                          fill="currentColor"
                        />
                        <span className="font-bold text-gray-900">
                          {course.rating}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-blue-600">
                          {course.price}
                        </p>
                        <button className="text-xs font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest mt-1">
                          Preview →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 font-bold hover:bg-gray-100">
                2
              </button>
              <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 font-bold hover:bg-gray-100">
                3
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
