"use client";
import React from 'react';
import Sidebar from '@/app/client/components/Sidebar';
import { LayoutDashboard, BookOpen, GraduationCap, School } from 'lucide-react';

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Programs', href: '/admin/programs', icon: GraduationCap },
  { label: 'Schools', href: '/admin/schools', icon: School },
  { label: 'Analytics', href: '/admin/analytics', icon: LayoutDashboard },
  { label: 'Assignments', href: '/admin/assign', icon: BookOpen },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        links={adminLinks}
        role="Admin"
        userName="Admin User"
        userImage="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
      />
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
