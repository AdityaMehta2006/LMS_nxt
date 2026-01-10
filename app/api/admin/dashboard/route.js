import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { role: true }
    });

    if (!user || user.role?.roleName !== 'Admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const totalUsers = await prisma.user.count();

    const allRoles = await prisma.role.findMany();

    // Group roles for stats
    const teacherRoleIds = allRoles
      .filter(r => ['teacher', 'teaching assistant', 'teacher assistant'].includes(r.roleName.toLowerCase()))
      .map(r => r.id);

    const editorRoleIds = allRoles
      .filter(r => ['editor', 'publisher'].includes(r.roleName.toLowerCase()))
      .map(r => r.id);

    // Count users matching these roles
    const teachers = teacherRoleIds.length > 0 ? await prisma.user.count({ where: { roleId: { in: teacherRoleIds } } }) : 0;
    const editors = editorRoleIds.length > 0 ? await prisma.user.count({ where: { roleId: { in: editorRoleIds } } }) : 0;

    const schools = await prisma.school.count();
    const totalPrograms = await prisma.program.count();
    const totalTopics = await prisma.contentItem.count();
    const topicsPublished = await prisma.contentItem.count({ where: { workflowStatus: 'Published' } });

    // Analytics Data: Program-wise stats
    const programsData = await prisma.program.findMany({
      include: {
        _count: {
          select: { courses: true }
        },
        courses: {
          select: {
            _count: {
              select: { sections: true } // Proxy for activity
            }
          }
        }
      }
    });

    const analytics = programsData.map(p => {
      // Abbreviate name: Get first letters of each word
      const abbr = p.programName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 4);
      return {
        name: abbr,
        fullName: p.programName,
        courses: p._count.courses,
        // A simple metric: sum of sections or similar. For topics, we'd need deeper nesting or a separate query. 
        // Keeping it simple for speed: Courses count is a good metric.
      };
    });

    const usersRaw = await prisma.user.findMany({
      include: {
        role: true,
        school: true // Include school info
      },
      orderBy: { id: 'desc' }
    });

    const usersFormatted = usersRaw.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      email: u.email,
      role: u.role ? u.role.roleName.toLowerCase() : 'unknown',
      department: u.school ? u.school.name : 'N/A' // Return department if available
    }));

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTeachers: teachers,
        totalEditors: editors,
        totalSchools: schools,
        totalPrograms,
        totalTopics,
        topicsPublished
      },
      analytics,
      users: usersFormatted,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
  }
}
