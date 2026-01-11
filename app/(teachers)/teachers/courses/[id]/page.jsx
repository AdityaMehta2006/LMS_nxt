"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  Tooltip,
  IconButton,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import { Trash, FileCheck, CheckCircle, PlayCircle, MessageSquare, Send, Download, Edit2, Save, X } from "lucide-react";
import ProgressBar from "../../../../client/components/ProgressBar";
import Createunitmodal from "../../../../client/components/Createunitmodal";
import CreateTopicmodal from "../../../../client/components/CreateTopicmodal";
import ScriptDialogue from "../../../../client/components/ScriptDialogue";
import ReviewDialogue from "../../../../client/components/ReviewDialogue";
import CourseHeader from "@/app/client/components/CourseHeader";
import TopicTimeline from "@/app/client/components/TopicTimeline";

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

  // Editing State
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEditUnit = (e, id, currentName) => {
    e.stopPropagation();
    setEditingUnitId(id);
    setEditValue(currentName);
  };

  const handleSaveUnit = async (e, unitId) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/teacher/update-unit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, newTitle: editValue }),
      });
      if (res.ok) {
        setEditingUnitId(null);
        fetchCourse();
      } else {
        alert("Failed to update unit name");
      }
    } catch (error) {
      console.error("Error updating unit:", error);
    }
  };

  const handleCancelEditUnit = (e) => {
    e.stopPropagation();
    setEditingUnitId(null);
  };

  const handleStartEditTopic = (topic) => {
    setEditingTopicId(topic.content_id);
    setEditValue(topic.name);
  };

  const handleSaveTopic = async (topicId) => {
    try {
      const res = await fetch("/api/teacher/update-topic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, newTitle: editValue }),
      });
      if (res.ok) {
        setEditingTopicId(null);
        fetchCourse();
      } else {
        alert("Failed to update topic name");
      }
    } catch (error) {
      console.error("Error updating topic:", error);
    }
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

  const handleApprove = async (topicOrId) => {
    // Handle both ID (from ReviewDialogue) and Topic Object (from TopicTimeline)
    const topicId = typeof topicOrId === 'object' ? topicOrId.content_id || topicOrId.id : topicOrId;
    const status = typeof topicOrId === 'object' ? topicOrId.status || topicOrId.workflow_status || topicOrId.workflowStatus : null;

    const isMaterialsApproval = status?.toLowerCase() === 'scripted';

    try {
      let apiUrl = `/api/teacher/approve-video`;
      let bodyData = { topicId };

      if (isMaterialsApproval) {
        apiUrl = `/api/topics/approve-materials`;
        // approve-materials handles status transition to Editing internally
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setOpenReviewModal(false);
        setCurrentTopic(null);
        fetchCourse();
      } else {
        const err = await res.json();
        alert(`Failed to approve: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving topic:', error);
      alert(`Error approving topic: ${error.message}`);
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

  const userRole = course.userRole;
  const canApprove = ['teaching assistant', 'teacher assistant', 'admin'].includes(userRole?.toLowerCase());

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
    </div >
  );
}