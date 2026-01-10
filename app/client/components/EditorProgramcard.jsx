"use client";
import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const EditorProgramcard = ({ id, programName, programCode, schoolName }) => {
  const router = useRouter();

  return (
    <Card
      className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-l-4 border-l-blue-500 bg-white dark:bg-gray-800 dark:border-t dark:border-r dark:border-b dark:border-gray-700"
      onClick={() => {
        // Navigate to editor courses page with program filter
        router.push(`/editor/courses?program=${encodeURIComponent(programName)}`);
      }}
    >
      <CardContent className="p-6">
        <Box className="flex flex-col h-full">
          {/* Program Header */}
          <Box className="flex items-center gap-2 mb-3">
            <Typography
              variant="h6"
              component="h3"
              className="font-bold text-gray-800 dark:text-gray-100 leading-tight"
            >
              {programName}
            </Typography>
          </Box>

          {/* Program Code */}
          <Box className="flex items-center gap-2 mb-3">
            <Chip
              label={programCode}
              size="small"
              variant="outlined"
              className="font-mono font-semibold dark:text-blue-300 dark:border-blue-800"
              color="primary"
            />
          </Box>

          {/* School */}
          <Box className="flex items-center gap-2 mb-4">
            <Typography
              variant="body2"
              className="text-gray-600 dark:text-gray-400 flex-1"
            >
              {schoolName}
            </Typography>
          </Box>

          {/* Footer */}
          <Box className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <Typography
              variant="caption"
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
            >
              View Program Details →
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditorProgramcard;