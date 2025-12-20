"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Autocomplete,
    TextField,
    CircularProgress
} from "@mui/material";
import { PersonAdd, Delete, AssignmentInd, School } from "@mui/icons-material";
import { motion } from "framer-motion";

const AdminAssign = () => {
    const [assignments, setAssignments] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assignRes, usersRes, coursesRes] = await Promise.all([
                fetch("/api/admin/assign"),
                fetch("/api/admin/dashboard"),
                fetch("/api/teacher/display")
            ]);

            const assignData = await assignRes.json();
            const usersData = await usersRes.json();
            const coursesData = await coursesRes.json();

            setAssignments(Array.isArray(assignData) ? assignData : []);

            // Filter only eligible roles (Teacher, Teaching Assistant, Editor, etc.)
            const eligibleRoles = ['teacher', 'editor', 'teaching assistant', 'publisher', 'admin'];
            setUsers((usersData.users || []).filter(u => u.role && eligibleRoles.includes(u.role.toLowerCase())));

            setCourses(coursesData.courses || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
            alert("Failed to load data. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async () => {
        if (!selectedUser || !selectedCourse) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    courseId: selectedCourse.course_id || selectedCourse.id
                })
            });

            if (res.ok) {
                await fetchData(); // Refresh table
                setSelectedUser(null);
                setSelectedCourse(null);
                alert("User assigned successfully!");
            } else {
                const err = await res.text();
                alert("Assignment failed: " + err);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevoke = async (userId, courseId) => {
        if (!confirm("Are you sure you want to revoke this assignment?")) return;

        try {
            const res = await fetch(`/api/admin/assign?userId=${userId}&courseId=${courseId}`, {
                method: "DELETE"
            });
            if (res.ok) fetchData();
            else alert("Failed to revoke assignment");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-gray-400">Loading assignments...</div>;

    return (
        <div className="flex flex-col gap-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Assignments</h1>
                <p className="text-gray-500 dark:text-gray-400">Assign teachers and editors to courses.</p>
            </motion.div>

            {/* ASSIGNMENT FORM */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <Autocomplete
                        options={users}
                        getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''} (${option.role || 'No Role'})`.trim()}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedUser}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        className="w-full md:w-1/3"
                        renderInput={(params) => <TextField {...params} label="Select User" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />}
                    />

                    <Autocomplete
                        options={courses}
                        getOptionLabel={(option) => `${option.course_code} - ${option.name}`}
                        isOptionEqualToValue={(option, value) => (option.course_id || option.id) === (value.course_id || value.id)}
                        value={selectedCourse}
                        onChange={(event, newValue) => setSelectedCourse(newValue)}
                        className="w-full md:w-1/3"
                        renderInput={(params) => <TextField {...params} label="Select Course" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />}
                    />

                    <Button
                        variant="contained"
                        onClick={handleAssign}
                        disabled={!selectedUser || !selectedCourse || submitting}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AssignmentInd />}
                        sx={{
                            height: '56px',
                            px: 4,
                            borderRadius: '12px',
                            fontWeight: 600,
                            // bgcolor: 'black',  <-- Removed to let Tailwind handle it
                            // '&:hover': { bgcolor: '#333' }
                        }}
                        className="bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                        {submitting ? 'Assigning...' : 'Assign Role'}
                    </Button>
                </div>
            </motion.div>

            {/* ASSIGNMENTS TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Assignments</h2>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'transparent' }} className="bg-gray-50 dark:bg-gray-700/50">
                                <TableCell sx={{ fontWeight: 600 }} className="text-gray-500 dark:text-gray-300">User</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} className="text-gray-500 dark:text-gray-300">Role</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} className="text-gray-500 dark:text-gray-300">Course</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} className="text-gray-500 dark:text-gray-300">Program</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }} className="text-gray-500 dark:text-gray-300">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignments.map((assign) => (
                                <TableRow key={`${assign.userId}-${assign.courseId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 dark:text-white">
                                                {assign.user?.firstName} {assign.user?.lastName}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{assign.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={assign.user?.role?.roleName || 'Unknown'}
                                            size="small"
                                            sx={{
                                                fontWeight: 600
                                            }}
                                            className={assign.user?.role?.roleName === 'Teacher'
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800 dark:text-white">{assign.course?.courseCode}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{assign.course?.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="dark:text-gray-300">{assign.course?.program?.programName}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleRevoke(assign.userId, assign.courseId)}
                                            size="small"
                                            color="error"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {assignments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#9ca3af' }}>
                                        No active assignments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>
        </div>
    );
};

export default AdminAssign;
