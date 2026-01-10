
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    { department: { contains: 'Commerce' } },
                    { program: { contains: 'Commerce' } },
                    { title: { contains: 'Commerce' } },
                    { department: { contains: 'Management' } } // Also check Management as fallback
                ]
            },
            include: {
                assignments: {
                    include: { user: true }
                }
            }
        });

        // Also get all assignments to check raw table if needed, but assigned_teachers should cover it if schema is correct
        // Checking UserCourseAssignment if it exists
        const assignments = await prisma.userCourseAssignment.findMany({
            where: {
                course: {
                    department: { contains: 'Commerce' }
                }
            },
            include: {
                user: true,
                course: true
            }
        })

        const responseData = {
            count: courses.length,
            courses: courses.map(c => ({
                id: c.id,
                title: c.title || c.course_name || c.name,
                department: c.department,
                assigned_teachers: c.assignments.map(a => `${a.user.firstName} ${a.user.lastName} (${a.user.email})`),
                assignments_raw: assignments.filter(a => a.courseId === c.id) // assignments variable is still valid from second query
            }))
        };
        console.log("DEBUG COMMERCE DATA:", JSON.stringify(responseData, null, 2));
        return NextResponse.json(responseData);
    } catch (error) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 200 });
    }
}
