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
        "h-full w-full bg-white rounded-lg",
        "border border-gray-200 border-l-4 border-l-sky-500", // Sky blue for Editor
        "shadow-sm hover:shadow-md transition-all duration-200",
        "p-4"
      )}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full w-max mb-2">
            {courseId}
          </span>
          <h2 className="text-lg font-bold text-gray-800 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
            {Course}
          </h2>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Units */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center">
          <Layers size={16} className="text-gray-500 mb-1" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">{unitCount || 0}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Units</span>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center">
          <BookOpen size={16} className="text-gray-500 mb-1" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">{topicCount || 0}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCoursecard;