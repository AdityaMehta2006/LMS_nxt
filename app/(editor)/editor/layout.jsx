"use client";
import React from 'react';
import Sidebar from '@/app/client/components/Sidebar';
import { LayoutDashboard, BookOpen, GraduationCap } from 'lucide-react';

const editorLinks = [
  { label: 'Dashboard', href: '/editor/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/editor/courses', icon: BookOpen },
  { label: 'Programs', href: '/editor/programs', icon: GraduationCap },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        links={editorLinks}
        role="Editor"
        userName="Editor User"
        userImage="https://api.dicebear.com/7.x/avataaars/svg?seed=Editor"
      />
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
