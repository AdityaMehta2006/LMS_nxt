"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import EditorCoursecard from "@/app/client/components/EditorCoursecard";

function CourseContent() {
  const searchParams = useSearchParams();
  // --- Data state ---
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programmeOptions, setProgrammeOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");

  // --- Fetch data ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/editor/courses");
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

        const programParam = searchParams.get("program");
        if (programParam) {
          setSelectedProgramme(programParam);
        } else {
          setFilteredCourses(mydata);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  // --- Apply filters ---
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

  // --- Handlers ---
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading courses...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Courses</h1>
        <p className="text-gray-500 dark:text-gray-400">Access and edit your assigned course materials.</p>
      </motion.div>

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
              key={item.course_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EditorCoursecard
                id={item.course_id}
                courseId={item.course_code}
                Course={item.name}
                unitCount={item.unit_count}
                topicCount={item.topic_count}
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