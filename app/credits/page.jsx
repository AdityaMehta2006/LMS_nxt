"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Award, User, Code2, Sparkles, GraduationCap } from "lucide-react";
import { Button, IconButton } from "@mui/material";

// Team Data
const teamMembers = [
    {
        id: 1,
        name: 'K Suraj Das',
        regNo: '2440224',
        dept: 'Department of Computer Science',
        role: 'Full Stack Developer',
        github: "https://github.com/suraj211223",
        linkedin: "https://www.linkedin.com/in/suraj-das-8b2896232",
        color: "from-blue-500 to-cyan-400"
    },
    {
        id: 2,
        name: 'Rithesh K R',
        regNo: '2440233',
        dept: 'Department of Computer Science',
        role: 'Full Stack Developer',
        github: 'https://github.com/Rithesh077',
        linkedin: 'https://www.linkedin.com/in/rithesh-k-r-284315325',
        color: "from-violet-500 to-purple-400"
    },
    {
        id: 3,
        name: 'Aditya Mehta',
        regNo: '2440204',
        dept: 'Department of Computer Science',
        role: 'Full Stack Developer',
        github: 'https://github.com/AdityaMehta2006',
        linkedin: 'https://www.linkedin.com/in/aditya-mehta-155a40315/',
        color: "from-fuchsia-500 to-pink-400"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function CreditsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden relative selection:bg-blue-500/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/login")}
                        className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 backdrop-blur-sm hover:bg-white dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </motion.button>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white">
                        Credits & <br className="hidden md:block" />
                        <span className="text-blue-600 dark:text-blue-500">Acknowledgments</span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Crafted with passion by the students of the <span className="font-semibold text-gray-900 dark:text-gray-200">Department of Computer Science</span>.
                    </p>
                </motion.div>

                {/* Mentor Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-24 flex justify-center"
                >
                    <div className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="relative bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-[22px] p-8 md:p-10 text-center max-w-2xl">
                            <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <Award size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Special Gratitude</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                We extend our heartfelt gratitude to <span className="font-bold text-orange-500 dark:text-orange-400">Dr. Ashok Immanuel</span> for his invaluable guidance, mentorship, and support throughout this journey.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Team Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px w-12 bg-gray-200 dark:bg-gray-800" />
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400">The Builders</span>
                        <div className="h-px w-12 bg-gray-200 dark:bg-gray-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group relative"
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                                <div className="relative h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col items-center text-center">

                                    {/* Gradient Border Top */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${member.color}`} />

                                    {/* Avatar Placeholder */}
                                    <div className={`w-24 h-24 mb-6 rounded-full bg-gradient-to-br ${member.color} p-[2px]`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                            <User size={40} className="text-gray-400 dark:text-gray-500" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{member.regNo}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{member.role}</p>

                                    <div className="mt-auto w-full pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-4">
                                        <motion.a
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                        >
                                            <Github size={20} />
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#0077b5] hover:text-white transition-all"
                                        >
                                            <Linkedin size={20} />
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                        <Code2 size={16} />
                        <span>Built for LMS Nxt Gen</span>
                        <span className="mx-2">•</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
