"use client";

import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ label, value, icon: Icon, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 group"
        >
            {/* Gradient Accent Background */}
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all opacity-20 group-hover:opacity-30"
                style={{ backgroundColor: color }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div
                        className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: color }}
                    >
                        {Icon && <Icon size={24} />}
                    </div>
                    {/* Decorative simplified line or dot */}
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                </div>

                <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                        {value}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {label}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
