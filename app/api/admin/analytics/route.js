import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const rawPrograms = await prisma.program.findMany({
            include: {
                courses: {
                    include: {
                        sections: {
                            include: {
                                contents: {
                                    select: {
                                        workflowStatus: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Transform Data for Analytics
        const analytics = rawPrograms.map(prog => {
            let totalCourses = prog.courses.length;
            let totalTopics = 0;
            let statusCounts = {
                Published: 0,
                Approved: 0,
                Under_Review: 0,
                Editing: 0,
                Planned: 0, // Catch-all for others if needed
            };

            prog.courses.forEach(course => {
                course.sections.forEach(section => {
                    section.contents.forEach(content => {
                        totalTopics++;
                        const status = content.workflowStatus || 'Planned';

                        // Map DB Enum to our Categories safely
                        if (status === 'Published') statusCounts.Published++;
                        else if (status === 'Approved') statusCounts.Approved++;
                        else if (status === 'Under_Review') statusCounts.Under_Review++;
                        else if (status === 'Editing') statusCounts.Editing++;
                        else statusCounts.Planned++; // Group the rest as Planned/Draft
                    });
                });
            });

            return {
                id: prog.id,
                name: prog.programName,
                courseCount: totalCourses,
                topicCount: totalTopics,
                statusDistribution: [
                    { name: 'Published', value: statusCounts.Published, fill: '#10b981' }, // Emerald
                    { name: 'Approved', value: statusCounts.Approved, fill: '#3b82f6' },  // Blue
                    { name: 'Review', value: statusCounts.Under_Review, fill: '#f59e0b' }, // Amber
                    { name: 'Editing', value: statusCounts.Editing, fill: '#8b5cf6' },   // Violet
                    { name: 'Planned', value: statusCounts.Planned, fill: '#cbd5e1' },   // Slate
                ]
            };
        });

        return NextResponse.json({ success: true, data: analytics });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
    }
}
