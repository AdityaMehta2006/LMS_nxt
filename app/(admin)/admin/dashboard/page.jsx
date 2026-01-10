"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Tooltip
} from "@mui/material";
import {
  PersonAdd,
  Delete,
  School,
  Edit,
  Search,
  FilterList,
  Sort,
  MoreVert,
  AdminPanelSettings,
  SupervisedUserCircle,
  AccountCircle
} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import StatsCard from "@/app/client/components/StatsCard"; // Imported shared component
import { BookOpen, Users, FileText, CheckCircle } from "lucide-react"; // Using Lucide icons for consistency where possible

// Dynamically import Recharts component with NO SSR
const AnalyticsCharts = dynamic(
  () => import("@/app/client/components/admin/AnalyticsCharts"),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-3xl animate-pulse" />
        <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-3xl animate-pulse" />
      </div>
    )
  }
);

const AdminDash = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalEditors: 0,
    totalPrograms: 0,
    totalTopics: 0,
    topicsPublished: 0
  });
  const [analytics, setAnalytics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data = await res.json();
      setStats(data.stats);
      setUsers(data.users);
      setAnalytics(data.analytics || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateUser = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setOpenUserModal(false);
        fetchDashboardData();
        setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "student" });
      } else {
        alert("Failed to create user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-8 text-left bg-gray-50/50 dark:bg-black min-h-screen p-6 md:p-8 rounded-3xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Cockpit</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">System overview and user management.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/assign')}
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 20px',
              borderWidth: '2px',
              '&:hover': { borderWidth: '2px' }
            }}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            Manage Assignments
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setOpenUserModal(true)}
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2)',
            }}
            className="bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          >
            New User
          </Button>
        </motion.div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard label="Programs" value={stats.totalPrograms} color="#3b82f6" icon={BookOpen} delay={0.1} />
        <StatsCard label="Topics" value={stats.totalTopics} color="#ec4899" icon={FileText} delay={0.2} />
        <StatsCard label="Teachers" value={stats.totalTeachers} color="#10b981" icon={Users} delay={0.3} />
        <StatsCard label="Editors" value={stats.totalEditors} color="#f59e0b" icon={Edit} delay={0.4} />
        <StatsCard label="Published" value={stats.topicsPublished} color="#8b5cf6" icon={CheckCircle} delay={0.5} />
      </div>

      {/* ANALYTICS CHARTS */}
      <AnalyticsCharts analytics={analytics} />

      {/* USERS TABLE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="!bg-white dark:!bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Table Header / Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Directory</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search className="text-gray-400" /></InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                width: '100%',
                maxWidth: '300px'
              }}
              className="bg-gray-50 dark:bg-gray-700 dark:text-white dark:[&_.MuiOutlinedInput-notchedOutline]:border-gray-600 dark:[&_.MuiInputBase-input]:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }} className="dark:text-gray-300">User</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }} className="dark:text-gray-300">Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }} className="dark:text-gray-300">Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280', textAlign: 'right' }} className="dark:text-gray-300">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ transition: 'background-color 0.2s' }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {user.firstName?.[0] || '?'}
                      </Avatar>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{user.firstName} {user.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                      className={(() => {
                        const r = user.role?.toLowerCase();
                        if (r === 'admin') return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
                        if (r === 'teacher') return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
                        if (r === 'editor') return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
                        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
                      })()}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton size="small" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVert fontSize="small" />
                      </IconButton>
                      {/* Action buttons logic reused */}
                      {user.role !== 'teacher' && (
                        <Tooltip title="Make Teacher">
                          <IconButton size="small" onClick={() => handleUpdateRole(user.id, 'teacher')} sx={{ color: '#10b981' }}>
                            <School fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {user.role !== 'editor' && (
                        <Tooltip title="Make Editor">
                          <IconButton size="small" onClick={() => handleUpdateRole(user.id, 'editor')} sx={{ color: '#f59e0b' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {user.role !== 'admin' && (
                        <Tooltip title="Delete User">
                          <IconButton size="small" onClick={() => handleDeleteUser(user.id)} sx={{ color: '#ef4444' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: '#9ca3af' }}>
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* CREATE USER MODAL */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New User</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex gap-4">
              <TextField label="First Name" fullWidth value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              <TextField label="Last Name" fullWidth value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            </div>
            <TextField label="Email" fullWidth type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <TextField label="Password" fullWidth type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={newUser.role} label="Role" onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} sx={{ borderRadius: '12px' }}>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teaching assistant">Teaching Assistant</MenuItem>
                <MenuItem value="publisher">Publisher</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenUserModal(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" sx={{ borderRadius: '10px', bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>Create User</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDash;