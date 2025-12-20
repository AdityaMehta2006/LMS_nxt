"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const EditorCoursecard = ({ id, courseId, Course, unitCount, topicCount }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/editor/courses/${id}`)}
      className={cn(
        "group cursor-pointer relative flex flex-col justify-between",
        "h-full w-full bg-white dark:bg-gray-800 rounded-2xl",
        "border border-gray-200 dark:border-gray-700",
        "shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        "p-5 overflow-hidden"
      )}
    >
      {/* Decorative Left Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 dark:bg-sky-600" />

      {/* HEADER */}
      <div className="flex flex-col mb-4 pl-2">
        <span className="text-[11px] font-bold text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30 px-2.5 py-0.5 rounded-full w-max mb-3 border border-sky-100 dark:border-sky-800/50">
          {courseId}
        </span>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
          {Course}
        </h2>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3 mt-auto pl-2">
        {/* Units */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 transition-colors">
          <Layers size={18} className="text-gray-400 dark:text-gray-500 mb-1 group-hover:text-sky-500 dark:group-hover:text-sky-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{unitCount || 0}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Units</span>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
          <BookOpen size={18} className="text-gray-400 dark:text-gray-500 mb-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{topicCount || 0}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCoursecard;