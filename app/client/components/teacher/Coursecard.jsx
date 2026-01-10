"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@mui/material";
import { BookOpen, Layers } from "lucide-react";


const Coursecard = ({ id, courseId, Course, unitCount, topicCount }) => {
  const router = useRouter();
  return (
    <Card className="h-full">
      <div className="bg-white dark:bg-gray-800 w-full border-l-4 border-t-2 border-r-2 border-b-2 border-r-gray-200 dark:border-r-gray-700 border-t-gray-200 dark:border-t-gray-700 border-b-gray-200 dark:border-b-gray-700 border-l-blue-500 h-88 text-black dark:text-white p-4 rounded-lg flex flex-col">

        {/* CONTENT */}
        <div className="grow">
          <h2 className="text-2xl mt-2 text-black dark:text-white line-clamp-3">{Course}</h2>
          <h3 className="font-bold text-blue-500 border-2 w-max p-1 rounded-3xl my-2 bg-blue-200/40 border-blue-500 text-sm">{courseId}</h3>
          {/* Cards */}
          <div className="mt-4">
            <div className="flex gap-3 w-full">
              {/* Units Card */}
              <div
                className="flex-1 rounded-xl p-3 border text-gray-700 dark:text-gray-200 h-16 flex flex-col justify-center bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Layers size={14} />
                  Units
                </div>
                <p className="text-xl font-semibold">{unitCount || 0}</p>
              </div>

              {/* Topics Card */}
              <div
                className="flex-1 rounded-xl p-3 border text-gray-700 dark:text-gray-200 h-16 flex flex-col justify-center bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800"
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <BookOpen size={14} />
                  Topics
                </div>
                <p className="text-xl font-semibold">{topicCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON AREA (Right Bottom) */}
        <div className="flex justify-end mt-4">
          <button className="rounded-lg text-white bg-gray-800 dark:bg-blue-600 hover:bg-gray-900 dark:hover:bg-blue-700 py-2 px-4 w-30 text-center transition-colors" onClick={() => router.push(`/teachers/courses/${id}`)}>
            Learn More
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Coursecard;
