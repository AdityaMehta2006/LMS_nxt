"use client";
import React from 'react';
import Sidebar from '@/app/client/components/Sidebar';
import { LayoutDashboard, BookOpen } from 'lucide-react';

const teacherLinks = [
  { label: 'Dashboard', href: '/teachers/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/teachers/courses', icon: BookOpen },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        links={teacherLinks}
        role="Teacher"
        userName="Teacher" // TODO: Fetch from context/auth
        userImage="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"
      />
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
