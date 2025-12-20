"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@mui/material";
import { BookOpen, Layers, Trash2 } from "lucide-react";


const AdminCoursecard = ({ id, courseId, Course, unitCount, topicCount }) => {
  const router = useRouter();
  return (
    <div
      className="group relative h-full w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
      onClick={() => router.push(`/admin/courses/${id}`)}
    >
      {/* Top Border Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="p-5 flex flex-col h-full">

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-xs font-semibold text-blue-600 dark:text-blue-300 mb-2 border border-blue-100 dark:border-blue-800">
              {courseId}
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {Course}
            </h2>
          </div>
          <button
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              // Add delete functionality here
              console.log('Delete course:', id);
            }}
            title="Delete Course"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* SPACER */}
        <div className="flex-grow" />

        {/* STATS */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Units */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center group/stat hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Layers size={18} className="text-gray-400 dark:text-gray-500 mb-1 group-hover/stat:text-blue-500 dark:group-hover/stat:text-blue-400" />
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{unitCount || 0}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Units</span>
          </div>

          {/* Topics */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center group/stat hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
            <BookOpen size={18} className="text-gray-400 dark:text-gray-500 mb-1 group-hover/stat:text-pink-500 dark:group-hover/stat:text-pink-400" />
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{topicCount || 0}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursecard;
