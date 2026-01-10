"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseHeader from "@/app/client/components/CourseHeader";
import TopicTimeline from "@/app/client/components/TopicTimeline";

export default function EditorCourseDetail() {
    const [course, setCourse] = useState(null);
    const [expandedUnit, setExpandedUnit] = useState(null);
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBack = () => {
        router.push('/editor/courses');
    };

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/teacher/display?courseId=${params.id}`);
            if (!res.ok) {
                throw new Error("Failed to fetch course data");
            }
            const data = await res.json();
            setCourse(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching course:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchCourse();
        }
    }, [params.id]);

    const handleDownload = async (topic, type) => {
        const url = `/api/download-topic-material?topicId=${topic.content_id}&type=${type}`;
        try {
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${topic.name}-${type}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download file");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-gray-500">Loading course data...</p></div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className="min-h-screen bg-transparent p-6 pb-20 pt-20">
            {/* 1. Header with Stats */}
            <CourseHeader
                course={course}
                onBack={handleBack}
            />

            {/* 2. Main Content / Timeline (Read Only) */}
            <div className="mt-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Course Journey
                    </h2>
                </div>

                <TopicTimeline
                    units={course.units}
                    userRole="editor" // Force editor role for correct strict permissions in component if needed
                    readOnly={true} // Hides upload/add buttons
                    onDownload={handleDownload}
                />
            </div>
        </div>
    );
}
