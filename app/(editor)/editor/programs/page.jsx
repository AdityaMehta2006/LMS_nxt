"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap } from "lucide-react";
import PremiumProgramCard from "@/app/client/components/PremiumProgramCard";
import { TextField, InputAdornment } from "@mui/material";

function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch('/api/editor/programs');
        if (!response.ok) throw new Error("Failed to fetch programs data");
        const data = await response.json();
        setPrograms(data.programs || []);
        setFilteredPrograms(data.programs || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = programs.filter(p =>
      p.program_name.toLowerCase().includes(lowerQuery) ||
      p.program_code.toLowerCase().includes(lowerQuery) ||
      p.school_name?.toLowerCase().includes(lowerQuery)
    );
    setFilteredPrograms(filtered);
  }, [searchQuery, programs]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 md:p-12 pb-20 pt-24">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Academic Programs
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Select a program to manage its courses and content.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <TextField
            fullWidth
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: 'white', // Default light mode
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '.dark & .MuiOutlinedInput-root': {
                backgroundColor: '#1f2937', // Dark mode bg
                color: 'white',
                '& fieldset': { borderColor: '#374151' },
              }
            }}
            className="dark:bg-gray-800 rounded-2xl"
          />
        </div>
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <PremiumProgramCard
                  key={program.program_id}
                  programName={program.program_name}
                  programCode={program.program_code}
                  schoolName={program.school_name}
                  onClick={() => router.push(`/editor/courses?program=${encodeURIComponent(program.program_name)}`)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No programs found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Programs;