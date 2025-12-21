"use client";

import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel
} from "@mui/material";
import {
  ExpandMore,
  VideoCall,
  Upload,
  CheckCircle,
  Description,
  Slideshow,
  FolderZip,
  Visibility,
  Search
} from "@mui/icons-material";
import { cn } from "@/lib/utils";

// --- ZEN COMPONENTS ---
const ZenStatsCard = ({ label, value, color, bg, borderColor, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 group"
      style={{ borderColor: borderColor }} // Note: Handling inline border color properly in dark mode might tricky if strict colors are passed.
    // Ideally, we should ignore inline border color in dark mode or replace it.
    // But let's just add dark classes for now.
    >
      {/* Decorative Blur - Adjust opacity for dark mode */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 transition-all opacity-50 dark:opacity-30" style={{ backgroundColor: bg }} />

      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          {value}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: color }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};

const EditorDash = () => {
  const [stats, setStats] = useState({
    totalTopics: 0,
    published: 0,
    inEditing: 0,
    scripted: 0,
    underReview: 0,
    readyForVideo: 0,
    approved: 0
  });
  const [topicsInProgress, setTopicsInProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [additionalLink, setAdditionalLink] = useState("");
  const [viewedFeedbackTopics, setViewedFeedbackTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [canPublish, setCanPublish] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [showMyTasks, setShowMyTasks] = useState(false);

  // Filter Logic
  const editingTopics = (topicsInProgress || []).filter(topic => {
    // 1. Status Filter
    if (filterStatus !== "All") {
      if (filterStatus === "In Editing" && !['Editing', 'Scripted', 'Post_Editing'].includes(topic.workflow_status)) return false;
      if (filterStatus === "Under Review" && !['Under_Review', 'ReadyForVideoPrep'].includes(topic.workflow_status)) return false;
      if (filterStatus === "Approved" && topic.workflow_status !== 'Approved') return false;
    }

    // 2. My Tasks Filter
    if (showMyTasks && currentUser) {
      // Check if assigned editor name matches current user name or contains it
      // Using loose matching for robustness
      const assigned = topic.assigned_editor_name?.toLowerCase().trim();
      const current = currentUser.name?.toLowerCase().trim();
      if (!assigned || !current || !assigned.includes(current)) {
        return false;
      }
    }

    // 3. Search Query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (topic.assigned_editor_name && topic.assigned_editor_name.toLowerCase().includes(query)) ||
      (topic.topic_title && topic.topic_title.toLowerCase().includes(query))
    );
  });

  const workflowSteps = [
    { id: 'Planned', label: 'Planned', color: '#64748b' },
    { id: 'Scripted', label: 'Scripted', color: '#3b82f6' },
    { id: 'Editing', label: 'Editing', color: '#f59e0b' },
    { id: 'Post_Editing', label: 'Post-Editing', color: '#f59e0b' },
    { id: 'ReadyForVideoPrep', label: 'Ready for Video', color: '#10b981' },
    { id: 'Under_Review', label: 'Under Review', color: '#8b5cf6' },
    { id: 'Approved', label: 'Approved', color: '#059669' },
    { id: 'Published', label: 'Published', color: '#22c55e' }
  ];

  const handleRecordClick = async (topic) => {
    if (topic.workflow_status === 'Editing' || topic.workflow_status === 'Scripted') {
      try {
        const res = await fetch(`/api/topics/update-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicId: topic.content_id, newStatus: 'Post_Editing' }),
        });
        if (res.ok) fetchDashboardData();
      } catch (error) { console.error('Error updating status:', error); }
    } else if (['Post_Editing', 'ReadyForVideoPrep', 'Under_Review'].includes(topic.workflow_status)) {
      setCurrentTopic(topic);
      setVideoLink(topic.video_link || "");
      setAdditionalLink(topic.additional_link || "");
      setUploadModalOpen(true);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoLink || !currentTopic) return;
    try {
      const res = await fetch(`/api/editor/upload-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: currentTopic.content_id,
          videoLink: videoLink,
          additionalLink: additionalLink,
          newStatus: 'Under_Review'
        }),
      });
      if (res.ok) {
        setUploadModalOpen(false);
        setVideoLink('');
        setCurrentTopic(null);
        fetchDashboardData();
      }
    } catch (error) { console.error('Error uploading video:', error); }
  };

  const handlePublish = async (topic) => {
    if (!window.confirm("Are you sure you want to publish this topic?")) return;
    try {
      const res = await fetch(`/api/topics/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic.content_id, newStatus: 'Published' }),
      });
      if (res.ok) fetchDashboardData();
      else alert("Failed to publish topic");
    } catch (error) { console.error('Error publishing topic:', error); }
  };

  const getWorkflowProgress = (status) => {
    const stepIndex = workflowSteps.findIndex(step => step.id === status);
    return stepIndex >= 0 ? ((stepIndex + 1) / workflowSteps.length) * 100 : 0;
  };

  const getStatusColor = (status) => {
    const step = workflowSteps.find(step => step.id === status);
    return step ? step.color : '#64748b';
  };

  const fetchCurrentUser = async () => {
    try {
      // Attempt to fetch user info. If /api/auth/me exists and returns user:
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error("Failed to fetch current user", e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/editor/dashboard");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.topicsInProgress) setTopicsInProgress(data.topicsInProgress);
      if (data.canPublish !== undefined) setCanPublish(data.canPublish);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCurrentUser();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Editor Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your production pipeline and uploads.</p>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ZenStatsCard label="Total Topics" value={stats.totalTopics} bg="#3b82f6" color="#1d4ed8" borderColor="#eff6ff" delay={0.1} />
        <ZenStatsCard label="In Editing" value={stats.inEditing} bg="#fb923c" color="#c2410c" borderColor="#fff7ed" delay={0.2} />
        <ZenStatsCard label="Under Review" value={stats.underReview} bg="#a855f7" color="#7e22ce" borderColor="#faf5ff" delay={0.3} />
        <ZenStatsCard label="Approved" value={stats.approved} bg="#10b981" color="#047857" borderColor="#ecfdf5" delay={0.4} />
        <ZenStatsCard label="Published" value={stats.published} bg="#22c55e" color="#15803d" borderColor="#f0fdf4" delay={0.5} />
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Workspace</h2>
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md">
            {editingTopics.length} Active
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <FormControlLabel
            control={
              <Switch
                checked={showMyTasks}
                onChange={(e) => setShowMyTasks(e.target.checked)}
                color="primary"
              />
            }
            label="My Tasks"
            className="text-gray-700 dark:text-gray-300 mr-2"
          />
          <FormControl size="small" sx={{ minWidth: 150 }} className="dark:bg-gray-700 rounded-lg">
            <InputLabel className={filterStatus !== "All" ? "" : "dark:text-gray-400"}>Status Filter</InputLabel>
            <Select
              value={filterStatus}
              label="Status Filter"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: '10px' }}
              className="dark:text-white"
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="In Editing">In Progress</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} className="dark:text-gray-400" />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px' }
            }}
            className="dark:bg-gray-700 dark:text-white rounded-lg"
          />
        </div>
      </div>

      {/* TOPIC LIST */}
      <AnimatePresence>
        {editingTopics.length > 0 ? (
          <div className="flex flex-col gap-3">
            {editingTopics.map((topic, index) => (
              <motion.div
                key={topic.content_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Accordion
                  expanded={expandedTopic === topic.content_id}
                  onChange={() => setExpandedTopic(expandedTopic === topic.content_id ? null : topic.content_id)}
                  sx={{
                    borderLeft: `4px solid ${getStatusColor(topic.workflow_status)}`,
                    borderRadius: '12px !important',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    '&:before': { display: 'none' },
                    backgroundColor: 'inherit' // Remove hardcoded white to allow Tailwind to control it
                  }}
                  className={cn(
                    "transition-colors",
                    topic.review_notes ? "bg-red-50 dark:bg-red-900/10" : "bg-white dark:bg-gray-800"
                  )}
                >
                  <AccordionSummary expandIcon={<ExpandMore className="dark:text-gray-400" />} sx={{ px: 3 }}>
                    <div className="flex items-center gap-4 w-full pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase">{topic.course_title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-gray-800 dark:text-gray-100">{topic.topic_title}</span>
                          {topic.assigned_editor_name && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              {topic.assigned_editor_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-auto flex gap-2">
                        {topic.review_notes && (
                          <Chip label="Feedback" size="small" color="error" variant="filled" />
                        )}
                        <Chip
                          label={topic.workflow_status.replace('_', ' ')}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(topic.workflow_status)}15`,
                            color: getStatusColor(topic.workflow_status),
                            fontWeight: 600
                          }}
                        />
                      </div>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3, backgroundColor: 'inherit' }} className="dark:text-gray-300">
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Program:</span> <span className="font-medium">{topic.program_name}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Unit:</span> <span className="font-medium">{topic.unit_title}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Editor:</span> <span className="font-medium">{topic.assigned_editor_name || 'Unassigned'}</span></div>
                          {topic.estimated_duration_min && <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Duration:</span> <span className="font-medium">{topic.estimated_duration_min}m</span></div>}
                        </div>
                        <div className="flex flex-col justify-end items-end gap-2">
                          {/* Download Buttons Row */}
                          <div className="flex gap-2">
                            {topic.has_doc && <IconButton onClick={() => window.open(`/api/download-topic-material?topicId=${topic.content_id}&type=doc`, '_blank')} size="small" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"><Description fontSize="small" /></IconButton>}
                            {topic.has_ppt && <IconButton onClick={() => window.open(`/api/download-topic-material?topicId=${topic.content_id}&type=ppt`, '_blank')} size="small" className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50"><Slideshow fontSize="small" /></IconButton>}
                            {topic.has_zip && <IconButton onClick={() => window.open(`/api/download-topic-material?topicId=${topic.content_id}&type=zip`, '_blank')} size="small" className="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50"><FolderZip fontSize="small" /></IconButton>}
                          </div>

                          {/* Action Button */}
                          <Button
                            variant="contained"
                            disabled={topic.workflow_status === 'Approved' && !canPublish}
                            startIcon={
                              (topic.workflow_status === 'Editing' || topic.workflow_status === 'Scripted') ? <VideoCall />
                                : (topic.workflow_status === 'Approved' ? <CheckCircle /> : <Upload />)
                            }
                            onClick={() => {
                              if (topic.workflow_status === 'Approved') handlePublish(topic);
                              else handleRecordClick(topic);
                            }}
                            sx={{
                              bgcolor: (topic.workflow_status === 'Editing' || topic.workflow_status === 'Scripted') ? "#dc2626"
                                : (topic.workflow_status === 'Approved' && canPublish ? "#10b981" : "#7c3aed"),
                              "&:hover": {
                                bgcolor: (topic.workflow_status === 'Editing' || topic.workflow_status === 'Scripted') ? "#b91c1c"
                                  : (topic.workflow_status === 'Approved' && canPublish ? "#059669" : "#6d28d9")
                              },
                              borderRadius: '10px',
                              fontWeight: 600,
                              px: 4
                            }}
                          >
                            {(topic.workflow_status === 'Editing' || topic.workflow_status === 'Scripted') ? "Start"
                              : (topic.workflow_status === 'Post_Editing' || topic.workflow_status === 'ReadyForVideoPrep' ? (topic.review_notes ? "Re-upload Video" : "Upload Video")
                                : (topic.workflow_status === 'Approved' ? "Publish"
                                  : "Edit Video Link"))}
                          </Button>
                        </div>
                      </div>

                      {topic.review_notes && topic.workflow_status !== 'Approved' && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 text-sm text-red-800 dark:text-red-200">
                          <strong>Feedback:</strong> {topic.review_notes}
                        </div>
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-gray-400 font-medium">No topics in progress</span>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO UPLOAD MODAL */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{currentTopic?.workflow_status === 'Under_Review' ? "Update Video Link" : "Upload Video Link"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Video URL"
              fullWidth
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Additional Resources URL (Optional)"
              fullWidth
              value={additionalLink}
              onChange={(e) => setAdditionalLink(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadModalOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button
            onClick={handleVideoUpload}
            variant="contained"
            disabled={!videoLink}
            sx={{ borderRadius: '10px', bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditorDash;
