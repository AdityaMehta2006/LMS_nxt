"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseHeader from "../../../../client/components/CourseHeader";
import TopicTimeline from "../../../../client/components/TopicTimeline";
import Createunitmodal from "../../../../client/components/Createunitmodal";
import CreateTopicmodal from "../../../../client/components/CreateTopicmodal";
import ScriptDialogue from "../../../../client/components/ScriptDialogue";
import ReviewDialogue from "../../../../client/components/ReviewDialogue";

export default function CourseStructureDesign() {
  const [course, setCourse] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const params = useParams();
  const router = useRouter();

  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [openTopicModal, setOpenTopicModal] = useState(false);
  const [openScriptModal, setOpenScriptModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [currentUnitId, setCurrentUnitId] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);

  // Download Menu State
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [activeDownloadTopic, setActiveDownloadTopic] = useState(null);

  const handleDownloadMenuOpen = (event, topic) => {
    setDownloadAnchorEl(event.currentTarget);
    setActiveDownloadTopic(topic);
  };

  const handleDownloadMenuClose = () => {
    setDownloadAnchorEl(null);
    setActiveDownloadTopic(null);
  };

  const downloadFile = (type) => {
    if (!activeDownloadTopic) return;
    const url = `/api/download/script?topicId=${activeDownloadTopic.content_id}&type=${type}`;
    window.open(url, '_blank');
    handleDownloadMenuClose();
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    router.push('/teachers/courses');
  };

  //  API FUNCTION to fetch course data
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

  const handleOpenTopicModal = (unitId) => {
    setCurrentUnitId(unitId); // Set context
    setOpenTopicModal(true);
  };

  const handleOpenScriptModal = (topic, unitIndex, topicIndex) => {
    setCurrentTopic({ ...topic, unitIndex, topicIndex });
    setOpenScriptModal(true);
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
        fetchCourse(); // Refresh to show updated status
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleDeleteTopic = async (topicId, topicTitle) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${topicTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/teacher/delete-topic?topicId=${topicId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete topic");
      }

      // Refresh the course data to show the updated list
      fetchCourse();

    } catch (error) {
      console.error("Error deleting topic:", error);
      alert(`Error deleting topic: ${error.message}`);
    }
  };

  const handleApprove = async (topicId) => {
    try {
      const res = await fetch(`/api/topics/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topicId,
          newStatus: 'Approved'
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

  // Function to approve script (TA only)
  const handleApproveScript = async (topicId) => {
    if (!window.confirm("Approve script and send to editor?")) return;
    try {
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

  const handleDownloadFile = (topic, type) => {
    const url = `/api/download/script?topicId=${topic.content_id}&type=${type}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-gray-500">Loading course data...</p></div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="min-h-screen bg-transparent p-6 pb-20">

      {/* 1. Header with Stats */}
      <CourseHeader
        course={course}
        onBack={handleBack}
      />

      {/* 2. Main Content / Timeline */}
      <div className="mt-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Journey
          </h2>
        </div>

        <TopicTimeline
          units={course.units}
          userRole={course.userRole}
          onAddUnit={() => setOpenUnitModal(true)}
          onAddTopic={(unitId) => handleOpenTopicModal(unitId)}
          onOpenScriptModal={handleOpenScriptModal}
          onOpenReviewModal={handleOpenReviewModal}
          onDeleteTopic={handleDeleteTopic}
          onApproveTopic={handleApprove}
          onApproveScript={handleApproveScript}
          onDownload={handleDownloadFile}
        />
      </div>

      {/* --- Modals (Keep existing functionality) --- */}
      <Createunitmodal
        open={openUnitModal}
        onClose={() => setOpenUnitModal(false)}
        courseId={params.id}
      />

      <CreateTopicmodal
        open={openTopicModal}
        onClose={() => setOpenTopicModal(false)}
        unitId={currentUnitId}
      />

      <ScriptDialogue
        open={openScriptModal}
        onClose={() => setOpenScriptModal(false)}
        topic={currentTopic}
        onUploadSuccess={fetchCourse}
      />

      <ReviewDialogue
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        topic={currentTopic}
        onFeedbackSubmit={handleFeedbackSubmit}
        onApprove={handleApprove}
        canApprove={canApprove}
      />
    </div>
  );
}