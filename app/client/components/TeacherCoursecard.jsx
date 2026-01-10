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
        "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
        "shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
      )}
    >
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

      {/* HEADER */}
      <div className="pt-2">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/30 text-xs font-semibold text-violet-600 dark:text-violet-300 mb-3 border border-violet-100 dark:border-violet-800">
          {courseId}
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
          {Course}
        </h2>
      </div>

      {/* STATS ROW */}
      <div className="mt-8 flex items-center gap-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
        {/* Units */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-colors">
          <Layers size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-none">{unitCount || 0}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 leading-none mt-0.5">Units</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 group-hover:bg-fuchsia-50 dark:group-hover:bg-fuchsia-900/20 transition-colors">
          <BookOpen size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-400 transition-colors" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-none">{topicCount || 0}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 leading-none mt-0.5">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoursecard;