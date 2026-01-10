"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, School, ArrowRight } from 'lucide-react';

const PremiumProgramCard = ({
    programName,
    programCode,
    schoolName,
    onClick,
    action, // e.g., Delete button for Admin
    colorGradient = "from-blue-500 to-indigo-600"
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="group relative h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/30"
        >
            {/* Gradient Top Line */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${colorGradient}`} />

            {/* Subtle Gradient Background Effect on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

            <div className="flex flex-col h-full relative z-10">

                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <School size={24} />
                    </div>
                    {action && (
                        <div onClick={(e) => e.stopPropagation()}>
                            {action}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mb-4 flex-1">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs font-bold tracking-wider mb-3 font-mono">
                        {programCode}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {programName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        {schoolName}
                    </p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">View Courses</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PremiumProgramCard;
