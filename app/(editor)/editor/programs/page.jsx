"use client";
import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import EditorProgramcard from "@/app/client/components/EditorProgramcard";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch('/api/editor/programs');
        if (!response.ok) {
          throw new Error("Failed to fetch programs data");
        }
        const data = await response.json();
        setPrograms(data.programs || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, [])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Box className="pt-25 p-6">
        <Typography variant="h3" component="h1" className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
          Academic Programs
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-6">
          Browse all academic programs offered by the institution
        </Typography>
      </Box>

      <div className="w-full text-black p-5">
        <Grid container spacing={3}>
          {programs.length > 0 ? (
            programs.map((program) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={program.program_id}>
                <EditorProgramcard
                  id={program.program_id}
                  programName={program.program_name}
                  programCode={program.program_code}
                  schoolName={program.school_name}

                />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Box className="text-center py-12">
                <Typography variant="h6" className="text-gray-500">
                  No programs found
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
}

export default Programs;