"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Menu } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Add, FilterList, Search } from "@mui/icons-material";
import AdminCoursecard from "../../../client/components/admin/Coursecard";
import CreateCourseModal from "../../../client/components/admin/CreateCourseModal";

function CourseContent() {
  const [open, setopen] = useState(false);
  const searchParams = useSearchParams();

  // Data state
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programmeOptions, setProgrammeOptions] = useState([]);

  // Filter state
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState(searchParams.get("program") || "");
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teacher/display");
      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const data = await response.json();
      const mydata = data.courses || [];
      setCourses(mydata);

      const schools = [...new Set(mydata.map(item => item.department).filter(Boolean))];
      const programmes = [...new Set(mydata.map(item => item.program).filter(Boolean))];
      setSchoolOptions(schools);
      setProgrammeOptions(programmes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters
  useEffect(() => {
    let tempCourses = [...courses];

    if (selectedSchool) {
      tempCourses = tempCourses.filter(course => course.department === selectedSchool);
    }
    if (selectedProgramme) {
      tempCourses = tempCourses.filter(course => course.program === selectedProgramme);
    }

    setFilteredCourses(tempCourses);
  }, [selectedSchool, selectedProgramme, courses]);

  const handleSchoolChange = (event) => {
    const newValue = event.target.value;
    setSelectedSchool(newValue);
    if (newValue) setSelectedProgramme("");
  };

  const handleProgrammeChange = (event) => {
    const newValue = event.target.value;
    setSelectedProgramme(newValue);
    if (newValue) setSelectedSchool("");
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData(); // Refresh list
      } else {
        const data = await res.json();
        alert(`Failed to delete course: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading courses...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">All Courses</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your institution's course catalog.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setopen(true)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'black',
              '&:hover': { bgcolor: '#333' },
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
            }}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 mx-auto"
          >
            Add Course
          </Button>
        </motion.div>
        <CreateCourseModal open={open} onClose={() => setopen(false)} />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4">
        <FormControl size="small" sx={{ minWidth: 240 }} className="dark:bg-gray-700 rounded-lg">
          <InputLabel className="dark:text-gray-300">Filter by School</InputLabel>
          <Select
            value={selectedSchool}
            label="Filter by School"
            onChange={handleSchoolChange}
            disabled={Boolean(selectedProgramme)}
            sx={{ borderRadius: '10px' }}
            className="dark:text-white"
          >
            <MenuItem value=""><em>All Schools</em></MenuItem>
            {schoolOptions.map((school) => (
              <MenuItem key={school} value={school}>{school}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 240 }} className="dark:bg-gray-700 rounded-lg">
          <InputLabel className="dark:text-gray-300">Filter by Programme</InputLabel>
          <Select
            value={selectedProgramme}
            label="Filter by Programme"
            onChange={handleProgrammeChange}
            disabled={Boolean(selectedSchool)}
            sx={{ borderRadius: '10px' }}
            className="dark:text-white"
          >
            <MenuItem value=""><em>All Programmes</em></MenuItem>
            {programmeOptions.map((prog) => (
              <MenuItem key={prog} value={prog}>{prog}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* GRID LAYOUT */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((item, index) => (
            <motion.div
              key={item.course_id || item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AdminCoursecard
                id={item.course_id}
                courseId={item.course_code}
                Course={item.name}
                unitCount={item.unit_count}
                topicCount={item.topic_count}
                onDelete={handleDeleteCourse}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-24 text-gray-400">
          No courses found matching your filters.
        </div>
      )}
    </div>
  );
}

export default function Course() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseContent />
    </Suspense>
  );
}