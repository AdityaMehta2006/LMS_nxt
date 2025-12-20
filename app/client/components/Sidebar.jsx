"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared Sidebar Component
 * @param {Object} props
 * @param {Array} props.links - Array of { label, href, icon: IconComponent }
 * @param {string} props.role - "Admin", "Teacher", "Editor"
 * @param {string} props.userName - Display name
 * @param {string} props.userImage - Profile image URL
 * @param {string} props.basePath - Base path for the role (e.g. "/admin")
 */
const Sidebar = ({ links, role, userName, userImage, basePath }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const sidebarVariants = {
        open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };

    return (
        <>
            {/* MOBILE HEADER (Visible only on small screens) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-4">
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg text-gray-800 tracking-tight">{role} Dashboard</span>
                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            {/* BACKDROP (Mobile only) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR CONTAINER */}
            <motion.aside
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className={cn(
                    "fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl lg:shadow-none lg:!translate-x-0 lg:!opacity-100 lg:!static lg:block", // lg:static makes it flow normally on desktop
                    "flex flex-col"
                )}
                // On desktop, we override the motion styles via CSS (lg:static) or valid classes 
                // Note: Framer motion style prop might conflict with lg:static if strict. 
                // A cleaner way for responsive framer motion is checking screen size, but CSS override usually works.
                style={{}} // Reset style for desktop if needed, managed by class `lg:translate-x-0`
            >
                {/* MOBILE CLOSE BUTTON */}
                <div className="lg:hidden absolute top-4 right-4">
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* PROFILE HEADER */}
                <div className="p-8 flex flex-col items-center border-b border-gray-50">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-violet-500 to-fuchsia-500">
                            <img
                                src={userImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-5 h-5 border-4 border-white rounded-full ${role === 'Admin' ? 'bg-emerald-500' : 'bg-violet-500'}`}></div>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-gray-800 tracking-tight">{userName || "User"}</h2>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{role}</span>
                </div>

                {/* SEARCH (Optional) */}
                <div className="px-6 py-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* NAVIGATION LINKS */}
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        const Icon = link.icon;

                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "text-white shadow-lg shadow-violet-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {/* Active Background Gradient */}
                                {isActive && (
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-r",
                                        role === 'Admin' ? "from-gray-900 to-gray-800" : "from-violet-600 to-indigo-600"
                                    )} />
                                )}

                                {/* Content */}
                                <span className="relative z-10 flex items-center gap-3">
                                    {Icon && <Icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />}
                                    {link.label}
                                </span>

                                {/* Hover Effect (Subtle slide) */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gray-50 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 -z-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* FOOTER / LOGOUT */}
                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={() => router.push("/login")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
