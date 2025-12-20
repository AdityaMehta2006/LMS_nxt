"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { LogOut, Menu, X, Search, Sun, Moon } from "lucide-react";
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const ThemeToggle = ({ collapsed }) => (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={collapsed ? "Toggle Theme" : ""}
            className={cn(
                "w-full flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium text-sm",
                collapsed ? "justify-center p-3" : "px-4 py-3"
            )}
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
    );

    const sidebarVariants = {
        open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };

    const NavContent = ({ collapsed = false }) => (
        <>
            {/* PROFILE HEADER */}
            <div className={cn("flex flex-col items-center border-b border-gray-50 dark:border-gray-800 transition-all duration-300", collapsed ? "p-4" : "p-8")}>
                <div className="relative">
                    <div className={cn("rounded-full p-1 bg-gradient-to-tr from-violet-500 to-fuchsia-500 transition-all duration-300", collapsed ? "w-10 h-10" : "w-20 h-20")}>
                        <img
                            src={userImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
                        />
                    </div>
                    {!collapsed && <div className={`absolute bottom-0 right-0 w-5 h-5 border-4 border-white dark:border-gray-900 rounded-full ${role === 'Admin' ? 'bg-emerald-500' : 'bg-violet-500'}`}></div>}
                </div>
                {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                        <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight text-center">{userName || "User"}</h2>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{role}</span>
                    </motion.div>
                )}
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    const Icon = link.icon;

                    return (
                        <button
                            key={link.href}
                            onClick={() => router.push(link.href)}
                            title={collapsed ? link.label : ""}
                            className={cn(
                                "w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                                isActive
                                    ? "text-white shadow-lg shadow-violet-200 dark:shadow-none"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                            )}
                        >
                            {/* Active Background Gradient */}
                            {isActive && (
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-r",
                                    role === 'Admin' ? "from-gray-900 to-gray-800 dark:from-white dark:to-gray-200" : "from-violet-600 to-indigo-600"
                                )} />
                            )}

                            {/* Active Text (Inverse for Admin Dark Mode if using white bg) */}
                            {/* NOTE: Changing inner text color if active and dark mode */}
                            <span className={cn("relative z-10 flex items-center gap-3", isActive && role === 'Admin' && "dark:text-black")}>
                                {Icon && <Icon size={20} className={isActive ? "text-white dark:text-inherit" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"} />}
                                {!collapsed && <span>{link.label}</span>}
                            </span>

                            {/* Hover Effect (Subtle slide) */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 -z-0" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* FOOTER / LOGOUT */}
            <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-2">
                <ThemeToggle collapsed={collapsed} />
                <button
                    onClick={() => router.push("/login")}
                    title={collapsed ? "Sign Out" : ""}
                    className={cn(
                        "w-full flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium text-sm",
                        collapsed ? "justify-center p-3" : "px-4 py-3"
                    )}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* MOBILE HEADER (Visible only on small screens) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 transition-colors">
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-tight">{role} Dashboard</span>
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
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* MOBILE SIDEBAR (Drawer) */}
            <motion.aside
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col"
            >
                <div className="absolute top-4 right-4">
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <NavContent collapsed={false} />
            </motion.aside>

            {/* DESKTOP SIDEBAR (Static) */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-4 right-[-14px] z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                    {isCollapsed ? <Menu size={20} /> : <Menu size={20} />}
                </button>

                <NavContent collapsed={isCollapsed} />
            </aside>
        </>
    );
};

export default Sidebar;
