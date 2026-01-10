
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCommerceCourses() {
    try {
        // 1. Find all courses related to "School of Commerce" or similar
        console.log("Checking for courses with 'Commerce' in department or program...");
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    { department: { contains: 'Commerce', mode: 'insensitive' } },
                    { program: { contains: 'Commerce', mode: 'insensitive' } },
                    { title: { contains: 'Commerce', mode: 'insensitive' } }
                ]
            },
            include: {
                assignments: {
                    include: {
                        user: true
                    }
                }
            }
        });

        console.log(`Found ${courses.length} courses.`);
        courses.forEach(c => {
            console.log(`[${c.id}] ${c.title} (Dept: ${c.department}, Prog: ${c.program})`);
            if (c.assignments.length === 0) {
                console.log("  -> NO TEACHERS ASSIGNED");
            } else {
                c.assignments.forEach(a => {
                    console.log(`  -> Assigned to: ${a.user.name} (${a.user.email}) - Role: ${a.role}`);
                });
            }
        });

        // 2. Find users who might be teachers in School of Commerce
        console.log("\nChecking for users in School of Commerce...");
        // Assuming there's no department field on User, but maybe we can look at assignments?
        // Or we can just list all teachers and their courses?

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCommerceCourses();
