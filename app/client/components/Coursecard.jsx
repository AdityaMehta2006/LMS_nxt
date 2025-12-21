"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminCoursecard = ({ id, courseId, Course, unitCount, topicCount, onDelete }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/courses/${id}`)}
      className={cn(
        "group cursor-pointer relative flex flex-col justify-between",
        "h-full w-full bg-white dark:bg-gray-800 rounded-lg",
        "border border-gray-200 dark:border-gray-700 border-l-4 border-l-emerald-500", // Color coding for "Active/Admin"
        "shadow-sm hover:shadow-md transition-all duration-200",
        "p-4"
      )}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full w-max mb-2">
            {courseId}
          </span>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {Course}
          </h2>
        </div>

        <button
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all z-10" // z-10 to stay above card click
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(id);
          }}
          title="Delete Course"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Units */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
          <Layers size={16} className="text-gray-500 dark:text-gray-400 mb-1" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{unitCount || 0}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Units</span>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
          <BookOpen size={16} className="text-gray-500 dark:text-gray-400 mb-1" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{topicCount || 0}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursecard;