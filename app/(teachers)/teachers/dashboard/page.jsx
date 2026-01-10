"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Chip,
    Button,
    Grid,
    Tooltip
} from "@mui/material";
import { ExpandMore, PlayCircle, CheckCircle, Visibility } from "@mui/icons-material";
import ReviewDialogue from "../../../client/components/ReviewDialogue";
import { cn } from "@/lib/utils";
import StatsCard from "@/app/client/components/StatsCard";
import { BookOpen, Layers, Eye, CheckSquare } from "lucide-react";

const TeacherDash = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalTopics: 0,
        totalUnits: 0,
        videosToReview: 0,
        videosPublished: 0
    });
    const [topicsForReview, setTopicsForReview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [canApprove, setCanApprove] = useState(false);

    // Workflow status colors
    const getStatusColor = (status) => {
        const colors = {
            'Planned': '#64748b',
            'Scripted': '#3b82f6',
            'Editing': '#f59e0b',
            'Post_Editing': '#f59e0b',
            'Post-Editing': '#f59e0b',
            'Ready_for_Video_Prep': '#10b981',
            'ReadyForVideoPrep': '#10b981',
            'Under_Review': '#8b5cf6',
            'Approved': '#22c55e',
            'Published': '#22c55e'
        };
        return colors[status] || '#64748b';
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/teacher/dashboard");
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data.stats) setStats(data.stats);
            if (data.topicsForReview) setTopicsForReview(data.topicsForReview);
            if (data.canApprove !== undefined) setCanApprove(data.canApprove);
            setError(null);
        } catch (err) {
            console.error("Error fetching dashboard:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReviewModal = (topic) => {
        setCurrentTopic({ ...topic, name: topic.topic_title, id: topic.content_id });
        setOpenReviewModal(true);
    };

    const handleApproveTopic = async (topicId) => {
        try {
            const res = await fetch(`/api/topics/update-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, newStatus: "Approved" }),
            });
            if (!res.ok) throw new Error("Failed to approve topic");
            setOpenReviewModal(false);
            setCurrentTopic(null);
            fetchDashboardData();
        } catch (error) {
            alert(`Error approving topic: ${error.message}`);
        }
    };

    const handleFeedbackSubmit = async (topicId, feedback) => {
        try {
            const res = await fetch("/api/teacher/submit-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, feedback }),
            });
            if (res.ok) fetchDashboardData();
            else alert("Failed to submit feedback");
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const reviewTopics = topicsForReview.filter(topic => topic.workflow_status === 'Under_Review');

    if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
    if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;

    return (
        <div className="flex flex-col gap-8 text-left bg-gray-50/50 dark:bg-black min-h-screen p-6 md:p-8 rounded-3xl">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2 mb-2"
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Teacher Overview</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">Welcome back, here's what's happening with your courses.</p>
            </motion.div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Total Topics" value={stats.totalTopics} color="#3b82f6" icon={BookOpen} delay={0.1} />
                <StatsCard label="Total Units" value={stats.totalUnits} color="#10b981" icon={Layers} delay={0.2} />
                <StatsCard label="Review Pending" value={stats.videosToReview} color="#fb923c" icon={Eye} delay={0.3} />
                <StatsCard label="Published" value={stats.videosPublished} color="#8b5cf6" icon={CheckSquare} delay={0.4} />
            </div>

            {/* REVIEW SECTION */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        Videos for Review
                        {reviewTopics.length > 0 && (
                            <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold px-2 py-1 rounded-full border border-violet-100 dark:border-violet-800">
                                {reviewTopics.length}
                            </span>
                        )}
                    </h2>
                </div>

                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {reviewTopics.length > 0 ? (
                            reviewTopics.map((topic, index) => (
                                <motion.div
                                    key={topic.content_id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Accordion
                                        expanded={expandedTopic === topic.content_id}
                                        onChange={() => setExpandedTopic(expandedTopic === topic.content_id ? null : topic.content_id)}
                                        sx={{
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                            borderRadius: '16px !important',
                                            '&:before': { display: 'none' },
                                            overflow: 'hidden',
                                            backgroundColor: 'inherit'
                                        }}
                                        className="bg-white dark:bg-gray-800"
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore className="text-gray-400" />}
                                            sx={{
                                                padding: '16px 24px',
                                                '&.Mui-expanded': { minHeight: 'auto' },
                                                backgroundColor: 'inherit'
                                            }}
                                            className="dark:text-white"
                                        >
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-violet-500 tracking-wider uppercase">
                                                        {topic.course_title}
                                                    </span>
                                                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                        {topic.topic_title}
                                                    </span>
                                                </div>
                                                <Chip
                                                    label="Ready for Review"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#f3e8ff',
                                                        color: '#7c3aed',
                                                        fontWeight: 600,
                                                    }}
                                                    className="dark:bg-violet-900 dark:text-violet-200"
                                                />
                                            </div>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: '0 24px 24px 24px', backgroundColor: 'inherit' }} className="dark:text-gray-300">
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Topic Details</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-gray-500 dark:text-gray-400">Program</div>
                                                        <div className="font-medium">{topic.program_name}</div>
                                                        <div className="text-gray-500 dark:text-gray-400">Unit</div>
                                                        <div className="font-medium">{topic.unit_title}</div>
                                                        {topic.estimated_duration_min && (
                                                            <>
                                                                <div className="text-gray-500 dark:text-gray-400">Duration</div>
                                                                <div className="font-medium">{topic.estimated_duration_min} min</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-end gap-3">
                                                    <div className="flex gap-3 justify-end">
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Visibility />}
                                                            onClick={() => router.push(`/teachers/courses/${topic.course_id}`)}
                                                            sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}
                                                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<PlayCircle />}
                                                            onClick={() => handleOpenReviewModal(topic)}
                                                            sx={{
                                                                borderRadius: '12px',
                                                                backgroundColor: '#8b5cf6',
                                                                '&:hover': { backgroundColor: '#7c3aed' },
                                                                boxShadow: 'none'
                                                            }}
                                                        >
                                                            Review Video
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                <span className="text-gray-400 dark:text-gray-500">No videos pending review. Good job!</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* REVIEW MODAL */}
            <ReviewDialogue
                open={openReviewModal}
                onClose={() => setOpenReviewModal(false)}
                topic={currentTopic}
                onFeedbackSubmit={handleFeedbackSubmit}
                onApprove={handleApproveTopic}
                canApprove={canApprove}
            />
        </div>
    );
};

export default TeacherDash;