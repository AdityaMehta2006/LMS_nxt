"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, Plus, Trash2 } from "lucide-react";
import PremiumProgramCard from "@/app/client/components/PremiumProgramCard";
import CreateProgramModal from "../../../client/components/admin/CreateProgramModal";
import { TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";

function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setopen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getPrograms() {
      try {
        const response = await fetch("/api/teacher/programs");
        if (!response.ok) throw new Error("Failed to fetch programs data");
        const data = await response.json();
        setPrograms(data.programs || []);
        setFilteredPrograms(data.programs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getPrograms();
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

  const handleDelete = (id) => {
    // Placeholder for delete logic
    console.log("Delete program", id);
    alert("Delete functionality to be implemented needs API connection.");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 md:p-12 pb-20 pt-24 text-gray-900 dark:text-gray-100">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Manage Programs
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Create and manage academic programs for the institution.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {/* Search Bar */}
          <div className="w-full sm:w-64">
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  height: '48px',
                  '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                },
                '.dark & .MuiOutlinedInput-root': {
                  backgroundColor: '#1f2937',
                  color: 'white',
                  '& fieldset': { borderColor: '#374151' },
                }
              }}
              className="dark:bg-gray-800 rounded-xl"
            />
          </div>

          <button
            onClick={() => setopen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Plus size={20} /> Add Program
          </button>
        </div>
        <CreateProgramModal open={open} onClose={() => setopen(false)} />
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
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
                    colorGradient="from-indigo-500 to-purple-600"
                    onClick={() => router.push(`/admin/courses?program=${encodeURIComponent(program.program_name)}`)}
                    action={
                      <Tooltip title="Delete Program">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(program.program_id);
                          }}
                          className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400">
                  No programs found matching "<strong>{searchQuery}</strong>"
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Programs;