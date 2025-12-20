"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Card, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
                <p className="font-bold text-gray-700 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgramId, setSelectedProgramId] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/analytics");
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const currentProgram = selectedProgramId === "all"
        ? null
        : data.find(p => p.id === selectedProgramId);

    // Derived Data for "All Programs" View
    const allProgramsChartData = data.map(p => ({
        name: p.name.split(" ")[0], // Shorten name
        Courses: p.courseCount,
        Topics: p.topicCount
    }));

    if (loading) return <div className="h-screen w-full flex items-center justify-center"><CircularProgress /></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pt-20 pl-20 pr-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Program Analytics</h1>
                    <p className="text-gray-500 mt-2 text-lg">Real-time insights into course development and status.</p>
                </div>

                <FormControl className="w-64 bg-white rounded-xl shadow-sm">
                    <Select
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                        displayEmpty
                        className="rounded-xl h-12"
                        sx={{
                            "& fieldset": { border: "1px solid #e2e8f0" },
                            "&:hover fieldset": { border: "1px solid #cbd5e1" },
                        }}
                    >
                        <MenuItem value="all">All Programs</MenuItem>
                        {data.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-6">

                {/* TOP STATS CARDS (Dynamic based on logic) */}
                <div className="col-span-12 grid grid-cols-3 gap-6 mb-2">
                    <Card className="p-6 rounded-2xl shadow-sm border border-emerald-100 bg-emerald-50/30 flex flex-col items-center justify-center">
                        <span className="text-emerald-600 font-medium mb-1 uppercase tracking-wider text-xs">Active Courses</span>
                        <span className="text-4xl font-black text-gray-900">
                            {selectedProgramId === "all" ? data.reduce((acc, curr) => acc + curr.courseCount, 0) : currentProgram?.courseCount || 0}
                        </span>
                    </Card>
                    <Card className="p-6 rounded-2xl shadow-sm border border-blue-100 bg-blue-50/30 flex flex-col items-center justify-center">
                        <span className="text-blue-600 font-medium mb-1 uppercase tracking-wider text-xs">Total Topics</span>
                        <span className="text-4xl font-black text-gray-900">
                            {selectedProgramId === "all" ? data.reduce((acc, curr) => acc + curr.topicCount, 0) : currentProgram?.topicCount || 0}
                        </span>
                    </Card>
                    <Card className="p-6 rounded-2xl shadow-sm border border-purple-100 bg-purple-50/30 flex flex-col items-center justify-center">
                        <span className="text-purple-600 font-medium mb-1 uppercase tracking-wider text-xs">Completion Rate</span>
                        <span className="text-4xl font-black text-gray-900">
                            --%
                        </span>
                    </Card>
                </div>

                {/* GRAPH 1: Program Comparison (Only visible when ALL selected) */}
                {selectedProgramId === "all" && (
                    <div className="col-span-12 lg:col-span-8">
                        <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Course & Topic Volume by Program</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={allProgramsChartData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="Courses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Topics" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                )}

                {/* GRAPH 2: Status Distribution (Pie Chart) */}
                <div className={cn("col-span-12", selectedProgramId === "all" ? "lg:col-span-4" : "lg:col-span-8 lg:col-start-3")}>
                    <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                            {selectedProgramId === "all" ? "Overall Topic Status" : "Topic Status Breakdown"}
                        </h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={selectedProgramId === "all"
                                            // Aggregate for all if needed, simplifiction: just take one or show empty
                                            ? data.reduce((acc, prog) => {
                                                // Combine all status distributions
                                                prog.statusDistribution.forEach((stat, idx) => {
                                                    if (!acc[idx]) acc[idx] = { ...stat, value: 0 };
                                                    acc[idx].value += stat.value;
                                                });
                                                return acc;
                                            }, [])
                                            : currentProgram?.statusDistribution
                                        }
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(selectedProgramId === "all"
                                            ? data[0]?.statusDistribution // minimal fallback for color map
                                            : currentProgram?.statusDistribution
                                        )?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
