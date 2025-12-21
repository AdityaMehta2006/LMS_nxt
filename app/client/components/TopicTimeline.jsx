"use client";

import React, { useState } from "react";
import {
    CheckCircle,
    Circle,
    Clock,
    FileCheck,
    MessageSquare,
    PlayCircle,
    Trash,
    Download,
    Send,
    MoreVertical,
    Plus,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Chip,
    Menu,
    MenuItem
} from "@mui/material";
import { cn } from "@/lib/utils";

// Helper to calculate unit duration
const getUnitDuration = (topics) => {
    if (!topics) return "0m";
    const totalMin = topics.reduce((acc, t) => acc + (parseInt(t.estimatedTime || t.estimated_duration_min) || 0), 0);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Map status to colors and icons
const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || "planned";
    switch (s) {
        case "published":
            return { color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle size={16} />, label: "Published" };
        case "approved":
            return { color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: <CheckCircle size={16} />, label: "Approved" };
        case "under_review":
            return { color: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: <Clock size={16} />, label: "Under Review" };
        case "scripted":
            return { color: "text-purple-500 bg-purple-500/10 border-purple-500/20", icon: <FileCheck size={16} />, label: "Scripted" };
        case "editing":
            return { color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20", icon: <PlayCircle size={16} />, label: "Editing" };
        default:
            return { color: "text-gray-400 bg-gray-500/10 border-gray-500/20", icon: <Circle size={16} />, label: "Planned" };
    }
};

export default function TopicTimeline({
    units,
    userRole,
    onAddUnit,
    onAddTopic,
    onOpenScriptModal,
    onOpenReviewModal,
    onDeleteTopic,
    onApproveTopic,
    onApproveScript,
    onDownload,
    readOnly = false
}) {

    // Permission Logic
    const canApprove = ['teaching assistant', 'teacher assistant', 'publisher', 'admin'].includes(userRole?.toLowerCase());
    const canEdit = ['teacher', 'teaching assistant', 'teacher assistant', 'admin', 'publisher'].includes(userRole?.toLowerCase());

    // Local state for dropdown menus
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [activeTopicForMenu, setActiveTopicForMenu] = useState(null);

    const handleMenuOpen = (event, topic) => {
        setMenuAnchorEl(event.currentTarget);
        setActiveTopicForMenu(topic);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setActiveTopicForMenu(null);
    };


    // State for expanded units (all expanded by default or none, let's say all)
    const [expandedUnits, setExpandedUnits] = useState({});

    // Initialize all expanded on mount or when units change
    React.useEffect(() => {
        if (units) {
            const initialstate = {};
            units.forEach(u => {
                initialstate[u.id || u.section_id] = true;
            });
            setExpandedUnits(initialstate);
        }
    }, [units]);

    const toggleUnit = (unitId) => {
        setExpandedUnits(prev => ({
            ...prev,
            [unitId]: !prev[unitId]
        }));
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            {(!units || units.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                    <p className="text-gray-500">No course structure yet.</p>
                    {!readOnly && (
                        <Button variant="contained" onClick={onAddUnit} sx={{ mt: 2 }} className="bg-black dark:bg-blue-600">
                            Create First Unit
                        </Button>
                    )}
                </div>
            )}

            {units && units.map((unit, uIndex) => {
                const unitId = unit.id || unit.section_id;
                const isExpanded = expandedUnits[unitId];

                return (
                    <div key={unitId} className="mb-8 relative group">
                        {/* Vertical Line Connector (Lesson Path) - Only if expanded */}
                        {isExpanded && (
                            <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 -z-10 group-last:hidden" />
                        )}

                        {/* UNIT HEADER */}
                        <div
                            className="flex items-center gap-4 mb-4 cursor-pointer p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                            onClick={() => toggleUnit(unitId)}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 z-10">
                                {uIndex + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    {unit.name}
                                    <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                        {getUnitDuration(unit.topics)} total
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Unit {unit.order} • {unit.topics?.length || 0} topics
                                </p>
                            </div>

                            {/* Collapse Icon */}
                            <IconButton size="small" className="text-gray-400">
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </IconButton>

                            {!readOnly && (
                                <Button
                                    size="small"
                                    startIcon={<Plus size={14} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddTopic(unit.section_id);
                                    }}
                                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 ml-2"
                                >
                                    Add Topic
                                </Button>
                            )}
                        </div>

                        {/* TOPICS LIST - Collapsible */}
                        {isExpanded && (
                            <div className="pl-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                {unit.topics?.map((topic, tIndex) => {
                                    const status = getStatusConfig(topic.status);
                                    const isLocked = topic.status?.toLowerCase() === "published";

                                    return (
                                        <div
                                            key={topic.id || topic.content_id}
                                            className="relative pl-10 transition-all hover:-translate-x-1"
                                        >
                                            {/* Topic Dot Connector */}
                                            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-black z-0" />
                                            {/* Connector Line to Card */}
                                            <div className="absolute left-0 top-1/2 w-10 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />

                                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

                                                {/* Index & Name */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Topic {uIndex + 1}.{tIndex + 1}
                                                        </span>
                                                        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase", status.color)}>
                                                            {status.icon} {status.label}
                                                        </div>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">
                                                        {topic.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {topic.estimatedTime || topic.estimated_duration_min || 0} min</span>
                                                        {topic.videoLink && <span className="text-blue-500 flex items-center gap-1">Video Attached</span>}
                                                    </div>
                                                </div>

                                                {/* Actions Toolbar */}
                                                <div className="flex items-center gap-1 self-end sm:self-center bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">

                                                    {/* 1. Review/Watch (Hide if published per user request) */}
                                                    {topic.videoLink && !isLocked && (
                                                        <Tooltip title="Review / Watch">
                                                            <IconButton size="small" onClick={() => onOpenReviewModal(topic)}>
                                                                <MessageSquare size={18} className="text-blue-500" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {/* 2. Upload/Script (Teacher/TA) - Fixed Logic: Enabled unless published */}
                                                    {canEdit && (
                                                        <Tooltip title={isLocked ? "Topic Published (Locked)" : "Upload / Edit Script"}>
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => onOpenScriptModal(topic, uIndex, tIndex)}
                                                                    disabled={isLocked}
                                                                >
                                                                    <FileCheck size={18} className={cn(isLocked ? "text-gray-400" : "text-purple-500")} />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}

                                                    {/* 3. Download (All) - Use Download Icon */}
                                                    <Tooltip title="Download Materials">
                                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, topic)}>
                                                            <Download size={18} className="text-gray-500" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* 4. Approve (TA/Admin only) */}
                                                    {canApprove && (
                                                        <Tooltip title="Approve Topic">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => onApproveTopic(topic.content_id)}
                                                                    disabled={isLocked || !['under_review', 'scripted'].includes(topic.status?.toLowerCase())}
                                                                    className={cn("text-emerald-600 disabled:text-gray-300")}
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}

                                                    {/* 5. Delete (Teacher/Admin) */}
                                                    {canEdit && (
                                                        <Tooltip title="Delete Topic">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => onDeleteTopic(topic.content_id, topic.name)}
                                                                    disabled={isLocked}
                                                                >
                                                                    <Trash size={18} />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )
            })}

            {!readOnly && (
                <div className="flex justify-center mt-12 mb-20">
                    <Button
                        variant="outlined"
                        startIcon={<Plus />}
                        onClick={onAddUnit}
                        className="rounded-xl px-8 py-3 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Add New Unit
                    </Button>
                </div>
            )}

            {/* Download Menu (Shared) */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 2,
                    sx: { borderRadius: '12px', minWidth: '180px' }
                }}
            >
                <MenuItem
                    onClick={() => { onDownload(activeTopicForMenu, 'ppt'); handleMenuClose(); }}
                    disabled={!activeTopicForMenu?.script?.ppt}
                    className="text-sm gap-2"
                >
                    <Download size={14} /> Download PPT
                </MenuItem>
                <MenuItem
                    onClick={() => { onDownload(activeTopicForMenu, 'doc'); handleMenuClose(); }}
                    disabled={!activeTopicForMenu?.script?.doc}
                    className="text-sm gap-2"
                >
                    <Download size={14} /> Download Script
                </MenuItem>
                <MenuItem
                    onClick={() => { onDownload(activeTopicForMenu, 'zip'); handleMenuClose(); }}
                    disabled={!activeTopicForMenu?.script?.zip}
                    className="text-sm gap-2"
                >
                    <Download size={14} /> Download Other
                </MenuItem>
            </Menu>

        </div>
    );
}
