import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This API route fixes the data inconsistency where "School of Management" reappears
// and needs to be merged into "School of Commerce, Finance and Accountancy".
export async function GET() {
    try {
        const correctSchoolName = "School of Commerce, Finance and Accountancy";
        const incorrectSchoolName = "School of Management";

        // 1. Find the correct school
        let correctSchool = await prisma.school.findFirst({
            where: { name: correctSchoolName },
        });

        if (!correctSchool) {
            // Create if missing
            correctSchool = await prisma.school.create({
                data: { name: correctSchoolName, code: "SCFA" }
            });
        }

        // 2. Find the incorrect school
        const incorrectSchool = await prisma.school.findFirst({
            where: { name: incorrectSchoolName },
        });

        if (incorrectSchool) {
            // 3. Move all programs from incorrect school to correct school
            const updatedPrograms = await prisma.program.updateMany({
                where: { schoolId: incorrectSchool.id },
                data: { schoolId: correctSchool.id },
            });

            // 4. Delete the incorrect school
            await prisma.school.delete({
                where: { id: incorrectSchool.id },
            });

            return NextResponse.json({
                message: "Fixed successfully",
                details: `Moved programs from '${incorrectSchoolName}' to '${correctSchoolName}' and deleted the old school.`
            });
        }

        return NextResponse.json({ message: "No incorrect school found. Data is already clean." });

    } catch (error) {
        console.error("Fix failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
