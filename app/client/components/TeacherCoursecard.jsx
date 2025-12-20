"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@mui/material"; // Keeping wrapper if needed, or replacing with div
import { BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const TeacherCoursecard = ({ id, courseId, Course, unitCount, topicCount }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/teachers/courses/${id}`)}
      className={cn(
        "group cursor-pointer relative flex flex-col justify-between",
        "h-full w-full p-5 rounded-2xl",
        "bg-white border border-gray-100",
        "shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]", // Extremely subtle, premium shadow
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1" // Slight lift on hover
      )}
    >
      {/* Decorative Top Accent (Minimal) */}
      <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* HEADER */}
      <div>
        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-50 text-xs font-medium text-gray-500 mb-3 border border-gray-100">
          {courseId}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-violet-600 transition-colors line-clamp-2">
          {Course}
        </h2>
      </div>

      {/* STATS ROW */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex gap-6">
          {/* Units */}
          <div className="flex items-center gap-2 group/stat">
            <div className="p-1.5 rounded-md bg-transparent group-hover/stat:bg-blue-50 transition-colors">
              <Layers size={16} className="text-gray-400 group-hover/stat:text-blue-500 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Units</span>
              <span className="text-sm font-medium text-gray-700">{unitCount || 0}</span>
            </div>
          </div>

          {/* Topics */}
          <div className="flex items-center gap-2 group/stat">
            <div className="p-1.5 rounded-md bg-transparent group-hover/stat:bg-pink-50 transition-colors">
              <BookOpen size={16} className="text-gray-400 group-hover/stat:text-pink-500 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Topics</span>
              <span className="text-sm font-medium text-gray-700">{topicCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoursecard;