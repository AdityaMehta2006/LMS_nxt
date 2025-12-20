import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const assignments = await prisma.userCourseAssignment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        courseCode: true,
                        program: { select: { programName: true } }
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
        return NextResponse.json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { userId, courseId } = await req.json();

        if (!userId || !courseId) {
            return new NextResponse("Missing user or course ID", { status: 400 });
        }

        // Verify User Role
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            include: { role: true }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const allowedRoles = ['teacher', 'teaching assistant', 'teacher assistant', 'editor', 'publisher', 'admin'];
        const userRole = user.role?.roleName?.toLowerCase().trim();

        if (!userRole || !allowedRoles.includes(userRole)) {
            return new NextResponse(`Invalid user role (${user.role?.roleName}). Only Teachers, TAs, Editors, Publishers, or Admins can be assigned.`, { status: 400 });
        }

        // Check if assignment exists
        const existing = await prisma.userCourseAssignment.findUnique({
            where: {
                user_course_unique: {
                    userId: parseInt(userId),
                    courseId: parseInt(courseId),
                },
            },
        });

        if (existing) {
            return new NextResponse("User is already assigned to this course", { status: 409 });
        }

        const assignment = await prisma.userCourseAssignment.create({
            data: {
                userId: parseInt(userId),
                courseId: parseInt(courseId),
            },
        });

        return NextResponse.json(assignment);
    } catch (error) {
        console.error("Error assigning course:", error);
        return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const courseId = searchParams.get("courseId");

        if (!userId || !courseId) {
            return new NextResponse("Missing userId or courseId", { status: 400 });
        }

        await prisma.userCourseAssignment.delete({
            where: {
                user_course_unique: {
                    userId: parseInt(userId),
                    courseId: parseInt(courseId),
                },
            },
        });

        return new NextResponse("Assignment revoked", { status: 200 });
    } catch (error) {
        console.error("Error revoking assignment:", error);
        return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
    }
}
