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

  const userRole = course.userRole;
  const canApprove = ['teaching assistant', 'teacher assistant', 'publisher'].includes(userRole?.toLowerCase());

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

        <CardContent>
          <div className="space-y-4">
            {course.units && course.units.length > 0 ? (
              course.units.map((unit, unitIndex) => {
                const unitId = unit.id || unit.section_id;
                return (
                  <Accordion
                    key={unitId}
                    expanded={expandedUnit === unitId}
                    onChange={() =>
                      setExpandedUnit(expandedUnit === unitId ? null : unitId)
                    }
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <div className="flex justify-between w-full items-center mr-4">
                        {editingUnitId === unitId ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="font-medium text-gray-500">Unit {unit.order}:</span>
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="border rounded px-2 py-1 text-sm text-black"
                              autoFocus
                            />
                            <IconButton size="small" onClick={(e) => handleSaveUnit(e, unit.section_id)} color="primary">
                              <Save size={18} />
                            </IconButton>
                            <IconButton size="small" onClick={handleCancelEditUnit} color="error">
                              <X size={18} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <span className="font-medium">
                              Unit {unit.order}: {unit.name}
                            </span>
                            <IconButton
                              size="small"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleStartEditUnit(e, unitId, unit.name)}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                          </div>
                        )}
                        <span className="text-gray-500 text-sm">
                          {unit.topics ? unit.topics.length : 0} topics
                        </span>
                      </div>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: "#f9fafb" }}>
                      <div className="space-y-2">
                        {!unit.topics ||
                          (unit.topics.length === 0 && (
                            <p className="text-gray-500 italic text-center py-4">
                              No topics added yet
                            </p>
                          ))}

                        {unit.topics &&
                          unit.topics.map((topic, topicIndex) => {
                            const topicStatus =
                              topic.status?.toLowerCase() || "planned";

                            // Logic for button requirements
                            const isScriptingDone = topicStatus !== "planned";
                            const isReviewStage = topicStatus === "under_review"; // Updated to match DB
                            const hasMaterials = topic.script?.ppt || topic.script?.doc || topic.script?.zip;

                            return (
                              <Paper
                                key={topic.id || topic.content_id}
                                elevation={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 2,
                                  mb: 1.5,
                                  borderRadius: 2,
                                  "&:hover": { boxShadow: 3 },
                                }}
                              >
                                {/* Topic Info */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Chip
                                    label={`${unitIndex + 1}.${topicIndex + 1}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                  />
                                  {editingTopicId === (topic.content_id) ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="border rounded px-2 py-1 text-sm text-black w-64"
                                        autoFocus
                                      />
                                      <IconButton size="small" onClick={() => handleSaveTopic(topic.content_id)} color="primary">
                                        <Save size={16} />
                                      </IconButton>
                                      <IconButton size="small" onClick={() => setEditingTopicId(null)} color="error">
                                        <X size={16} />
                                      </IconButton>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 group">
                                      <Typography variant="body1" fontWeight={500}>
                                        {topic.name}
                                      </Typography>
                                      {!["published", "approved"].includes(topicStatus) && (
                                        <IconButton
                                          size="small"
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => handleStartEditTopic(topic)}
                                        >
                                          <Edit2 size={14} />
                                        </IconButton>
                                      )}
                                    </div>
                                  )}
                                  <Chip
                                    label={`${topic.estimatedTime ||
                                      topic.estimated_duration_min ||
                                      0
                                      } min`}
                                    size="small"
                                    sx={{ bgcolor: "grey.200" }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <ProgressBar status={topicStatus} />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        textTransform: "capitalize",
                                        color: "text.secondary",
                                      }}
                                    >
                                      {topicStatus.replace('_', ' ')}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Topic Actions */}
                                <Box sx={{ display: "flex" }}>
                                  {topic.videoLink && (
                                    <Tooltip title={topicStatus === "published" ? "Video Published" : "Watch & Review"}>
                                      <span>
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          onClick={() => handleOpenReviewModal(topic)}
                                          disabled={topicStatus === "published"}
                                        >
                                          <MessageSquare />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )}

                                  <Tooltip
                                    title={
                                      (topicStatus === "planned" || topicStatus === "scripted")
                                        ? "Upload/Edit Script"
                                        : "Locked (Under Review/Published)"
                                    }
                                  >
                                    {/* Span wrapper is needed for Tooltip on disabled button */}
                                    <span>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleOpenScriptModal(
                                            topic,
                                            unitIndex,
                                            topicIndex
                                          )
                                        }
                                        disabled={topicStatus !== "planned" && topicStatus !== "scripted"}
                                      >
                                        <FileCheck />
                                      </IconButton>
                                    </span>
                                  </Tooltip>

                                  {/* Download Button */}
                                  <Tooltip title="Download Files">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleDownloadMenuOpen(e, topic)}
                                    >
                                      <Download />
                                    </IconButton>
                                  </Tooltip>

                                  {canApprove && ( // Conditional Render
                                    <Tooltip
                                      title={
                                        isReviewStage
                                          ? "Approve Topic (Send to Publisher)"
                                          : "Available only during review stage"
                                      }
                                    >
                                      <span>
                                        <IconButton
                                          size="small"
                                          disabled={!isReviewStage}
                                          onClick={() => handleApprove(topic.content_id)}
                                          color="success"
                                        >
                                          <CheckCircle />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )}

                                  {canApprove && topicStatus === "scripted" && (!hasMaterials || topic.materialsApproved) && ( // Approve Script Button (Text only OR after materials approved)
                                    <Tooltip title="Approve Script (Send to Editor)">
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleApproveScript(topic.content_id)}
                                          sx={{ color: "#f59e0b" }}
                                        >
                                          <Send />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )}

                                  {canApprove && hasMaterials && !topic.materialsApproved && topicStatus !== "published" && (
                                    <Tooltip title="Approve Materials & Send to Editor">
                                      <span>
                                        <IconButton
                                          size="small"
                                          color="warning"
                                          onClick={() => {
                                            if (window.confirm("Are you sure you want to approve these materials and send them to the editor?")) {
                                              fetch("/api/topics/approve-materials", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ topicId: topic.content_id })
                                              }).then(res => {
                                                if (res.ok) fetchCourse();
                                                else alert("Failed to approve materials");
                                              });
                                            }
                                          }}
                                        >
                                          <FileCheck />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )}

                                  <Tooltip title="Delete Topic">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleDeleteTopic(topic.content_id, topic.name)
                                      }
                                      disabled={topicStatus === "published"}
                                    >
                                      <Trash />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Paper>
                            );
                          })}

                        <Button
                          variant="contained"
                          className="w-full mt-2"
                          onClick={() => handleOpenTopicModal(unit.section_id)} // Use section_id, not prefixed id
                        >
                          + Add Topic
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No units found for this course
              </p>
            )}

            <Button
              variant="outlined"
              className="w-full"
              onClick={() => setOpenUnitModal(true)}
            >
              + Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>

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