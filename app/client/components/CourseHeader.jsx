"use client";

import React from "react";
import { ArrowLeft, Clock, BookOpen, Layers, BarChart } from "lucide-react";
import { Button, Box, Paper, Chip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CourseHeader({ course, onBack }) {
    const router = useRouter();

    if (!course) return null;

    // --- Calculate Stats ---
    const units = course.units || [];
    const allTopics = units.flatMap((u) => u.topics || []);

    const totalMinutes = allTopics.reduce((acc, topic) => {
        const duration = parseInt(topic.actual_duration_min) || parseInt(topic.estimated_duration_min) || parseInt(topic.estimatedTime) || 0;
        return acc + duration;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    // Format: "5.2 hrs" or similar as requested "convert it into hours"
    // User asked: "ont he top for total time convert it into hours"
    // "5h 20m" is also good, but maybe "5.3 hrs" is what they meant?
    // "5.2 hrs" is usually decimal hours.
    // Let's stick to "5h 20m" which is clearer, OR "5.3 hrs" if strictly requested.
    // User said: "on the top for total time convert it into hours" - likely means total as hours.
    // Let's do rounded decimal: (totalMinutes / 60).toFixed(1) + " hrs"
    const durationString = (totalMinutes / 60).toFixed(1) + " hrs";

    const completedTopics = allTopics.filter(t => t.status === "published" || t.status === "Published").length;
    const progress = allTopics.length > 0 ? Math.round((completedTopics / allTopics.length) * 100) : 0;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Back Button */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={onBack}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{ textTransform: 'none', borderRadius: '10px' }}
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    Back to Courses
                </Button>
            </div>

            {/* Hero Card */}
            <Paper
                elevation={0}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 border border-gray-200 dark:border-gray-800 p-8 text-white shadow-xl"
            >
                {/* Background Decorative Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

                    {/* Title & Meta */}
                    <div className="flex flex-col gap-3 max-w-2xl">
                        <div className="flex gap-2 flex-wrap">
                            <Chip
                                label={course.department || "Department"}
                                size="small"
                                className="bg-white/10 text-white backdrop-blur-md border-none"
                                sx={{ borderRadius: '8px' }}
                            />
                            <Chip
                                label={course.program || "Program"}
                                size="small"
                                className="bg-white/10 text-white backdrop-blur-md border-none"
                                sx={{ borderRadius: '8px' }}
                            />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                            {course.name || course.course_name}
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base max-w-xl">
                            Manage units, topics, and upload scripts. Track progress and materials.
                        </p>
                    </div>

                    {/* Key Stats Row */}
                    <div className="flex gap-4 md:gap-8 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">

                        {/* Units */}
                        <div className="flex flex-col items-center">
                            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                <Layers size={14} /> Units
                            </div>
                            <div className="text-2xl font-bold">{units.length}</div>
                        </div>

                        <div className="w-px bg-white/10 h-10 self-center" />

                        {/* Topics */}
                        <div className="flex flex-col items-center">
                            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                <BookOpen size={14} /> Topics
                            </div>
                            <div className="text-2xl font-bold">{allTopics.length}</div>
                        </div>

                        <div className="w-px bg-white/10 h-10 self-center" />

                        {/* Duration */}
                        <div className="flex flex-col items-center">
                            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                <Clock size={14} /> Est. Time
                            </div>
                            <div className="text-xl font-bold text-sky-400">{durationString}</div>
                        </div>

                        <div className="w-px bg-white/10 h-10 self-center" />

                        {/* Progress */}
                        <div className="flex flex-col items-center">
                            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                <BarChart size={14} /> Progress
                            </div>
                            <div className="text-xl font-bold text-emerald-400">{progress}%</div>
                        </div>
                    </div>

                </div>
            </Paper>
        </div>
    );
}
