"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";
import { Trash2 } from "lucide-react";
import CourseHeader from "@/app/client/components/CourseHeader";
import TopicTimeline from "@/app/client/components/TopicTimeline";
import ReviewDialogue from "@/app/client/components/ReviewDialogue";
import CreateTopicmodal from "@/app/client/components/CreateTopicmodal";
import Createunitmodal from "@/app/client/components/Createunitmodal";

export default function AdminCourseDetail({ params }) {
    const unwrappedParams = use(params);
    const courseId = unwrappedParams.course_id;

    const [course, setCourse] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [openReviewModal, setOpenReviewModal] = useState(false);

    // Modals for Creation (Admin capabilities)
    const [openUnitModal, setOpenUnitModal] = useState(false);
    const [openTopicModal, setOpenTopicModal] = useState(false);
    const [currentUnitId, setCurrentUnitId] = useState(null);

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBack = () => {
        router.push('/admin/courses');
    };

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/teacher/display?courseId=${courseId}`);
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
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const handleDownload = async (topic, type) => {
        // Updated to match the Teacher implementation logic or use existing API
        // Using existing logic from previous admin page but mapped to new handler signature
        // The TopicTimeline passes (topic, type).
        // Previous used: `/api/download-topic-material?topicId=${topicId}&type=${type}`
        // Teacher uses: `/api/download/script?topicId=${topic.content_id}&type=${type}`
        // Let's use the one that works. Assuming /api/download/script is the standardized one now.
        const url = `/api/download/script?topicId=${topic.content_id || topic.id.replace('t', '')}&type=${type}`;
        window.open(url, '_blank');
    };

    const handleDeleteCourse = async () => {
        if (!confirm("Are you sure you want to delete this ENTIRE COURSE? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/admin/courses");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete course");
            }
        } catch (err) {
            alert("Error deleting course");
        }
    };

    const handleDeleteUnit = async (unitId) => {
        // UnitID might be u123 or just 123
        const realId = String(unitId).replace('u', '');
        if (!confirm("Are you sure you want to delete this Unit? All topics within it will be lost.")) return;
        try {
            const res = await fetch(`/api/admin/units/${realId}`, { method: "DELETE" });
            if (res.ok) {
                fetchCourse();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete unit");
            }
        } catch (err) {
            alert("Error deleting unit");
        }
    };

    const handleDeleteTopic = async (topicId) => {
        const realId = String(topicId).replace('t', '');
        if (!confirm("Are you sure you want to delete this Topic?")) return;
        try {
            const res = await fetch(`/api/teacher/delete-topic?topicId=${realId}`, { method: "DELETE" });
            if (res.ok) {
                fetchCourse();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete topic");
            }
        } catch (err) {
            alert("Error deleting topic");
        }
    };

    const handleOpenReviewModal = (topic) => {
        setCurrentTopic(topic);
        setOpenReviewModal(true);
    };

    const handleFeedbackSubmit = async (topicId, feedback) => {
        try {
            const res = await fetch("/api/teacher/submit-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, feedback }),
            });

            if (res.ok) {
                fetchCourse();
            } else {
                alert("Failed to submit feedback");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    const handleApproveVideo = async (topicId) => {
        try {
            const res = await fetch(`/api/topics/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topicId: topicId,
                    newStatus: 'Published' // Admins publishing directly
                }),
            });

            if (res.ok) {
                fetchCourse();
            } else {
                alert("Failed to approve topic");
            }
        } catch (error) {
            console.error('Error approving topic:', error);
        }
    };

    const handleApproveScript = async (topicId) => {
        if (!window.confirm("Approve script and send to editor?")) return;
        try {
            // Admin approval usually means moving it forward. 
            // Logic from previous file: newStatus: 'Editing'
            const res = await fetch(`/api/topics/update-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, newStatus: 'Editing' }),
            });
            if (res.ok) fetchCourse();
            else alert("Failed to approve script");
        } catch (error) {
            console.error('Error approving script:', error);
        }
    };

    // Modal Opening Handlers
    const handleOpenTopicModal = (unitId) => {
        setCurrentUnitId(unitId);
        setOpenTopicModal(true);
    };


    if (loading) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
    if (!course) return <p className="p-8">Course not found</p>;


    return (
        <div className="space-y-6 p-6 pb-20">
            {/* Header with Stats */}
            <CourseHeader
                course={course}
                onBack={handleBack}
            />

            {/* Admin Controls */}
            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    onClick={handleDeleteCourse}
                    className="bg-red-600 hover:bg-red-700"
                >
                    Delete Entire Course
                </Button>
            </div>


            {/* Assignment Management (Preserved) */}
            <Card className="rounded-2xl border-none shadow-sm dark:bg-gray-800/50">
                <CardHeader
                    title={<span className="text-xl font-bold dark:text-white">Assigned Teachers</span>}
                    subheader={<span className="dark:text-gray-400">Manage who can access this course</span>}
                />
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <TextField
                            label="Teacher Email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            id="teacher-email-input"
                            className="bg-white dark:bg-gray-900 rounded-lg"
                        />
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const emailInput = document.getElementById("teacher-email-input");
                                const email = emailInput.value;
                                if (!email) return alert("Please enter an email");
                                try {
                                    const res = await fetch("/api/admin/assign", {
                                        method: "POST",
                                        body: JSON.stringify({ email, courseId }),
                                    });
                                    if (res.ok) {
                                        emailInput.value = "";
                                        fetchCourse();
                                    } else {
                                        const msg = await res.text();
                                        alert(msg);
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("Assignment failed");
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Assign
                        </Button>
                    </div>

                    <List>
                        {course.assigned_teachers && course.assigned_teachers.length > 0 ? (
                            course.assigned_teachers.map((teacher) => (
                                <ListItem key={teacher.id} divider className="dark:border-gray-700">
                                    <ListItemText
                                        primary={<span className="dark:text-white font-medium">{teacher.name}</span>}
                                        secondary={<span className="dark:text-gray-400">{teacher.email}</span>}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={async () => {
                                                if (!confirm(`Remove ${teacher.name} from this course?`)) return;
                                                try {
                                                    const res = await fetch("/api/admin/assign", {
                                                        method: "DELETE",
                                                        body: JSON.stringify({ userId: teacher.id, courseId }),
                                                    });
                                                    if (res.ok) fetchCourse();
                                                    else alert("Failed to remove assignment");
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                            color="error"
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" className="italic py-2">
                                No teachers assigned.
                            </Typography>
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* Standardized Course Timeline */}
            <div className="mt-8">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight="bold" className="dark:text-white">
                        Course Journey
                    </Typography>
                </Box>

                <TopicTimeline
                    units={course.units}
                    userRole="admin" // Hardcode admin role for ability
                    onAddUnit={() => setOpenUnitModal(true)}
                    onAddTopic={(unitId) => handleOpenTopicModal(unitId)}
                    onOpenScriptModal={() => alert("Admins: Please use Edit mode or login as Teacher to upload scripts.")} // Modals not imported yet for script? Or reuse?
                    onOpenReviewModal={handleOpenReviewModal}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteUnit={handleDeleteUnit}
                    onApproveTopic={handleApproveVideo}
                    onApproveScript={handleApproveScript}
                    onDownload={handleDownload}
                />
            </div>

            {/* Review Modal */}
            <ReviewDialogue
                open={openReviewModal}
                onClose={() => setOpenReviewModal(false)}
                topic={currentTopic}
                onFeedbackSubmit={handleFeedbackSubmit}
                onApprove={handleApproveVideo}
                canApprove={true}
            />

            {/* Creation Modals */}
            <Createunitmodal
                open={openUnitModal}
                onClose={() => setOpenUnitModal(false)}
                courseId={courseId}
            />

            <CreateTopicmodal
                open={openTopicModal}
                onClose={() => setOpenTopicModal(false)}
                unitId={currentUnitId}
            />

        </div>
    );
}
