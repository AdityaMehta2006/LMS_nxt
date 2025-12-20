import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const wrongName = "School of Management";
        const correctName = "School of Commerce, Finance and Accountancy";

        const schoolWrong = await prisma.school.findUnique({ where: { name: wrongName } });
        const schoolCorrect = await prisma.school.findUnique({ where: { name: correctName } });

        let logs = [];

        if (!schoolWrong) {
            return NextResponse.json({ message: `"${wrongName}" not found. No action needed.` });
        }

        if (!schoolCorrect) {
            logs.push(`Only "${wrongName}" found. Renaming to "${correctName}"...`);
            await prisma.school.update({
                where: { id: schoolWrong.id },
                data: { name: correctName }
            });
            logs.push("Renamed successfully.");
            return NextResponse.json({ logs });
        }

        logs.push(`Both schools found. Merging "${wrongName}" (ID: ${schoolWrong.id}) into "${correctName}" (ID: ${schoolCorrect.id})...`);

        // 1. Move Programs
        const updatePrograms = await prisma.program.updateMany({
            where: { schoolId: schoolWrong.id },
            data: { schoolId: schoolCorrect.id }
        });
        logs.push(`Moved ${updatePrograms.count} programs.`);

        // 2. Move Users
        const updateUsers = await prisma.user.updateMany({
            where: { schoolId: schoolWrong.id },
            data: { schoolId: schoolCorrect.id }
        });
        logs.push(`Moved ${updateUsers.count} users.`);

        // 3. Delete the wrong school
        await prisma.school.delete({
            where: { id: schoolWrong.id }
        });
        logs.push(`Deleted "${wrongName}". Merge complete.`);

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Error fixing schools:", error);
        return new NextResponse("Internal Server Error: " + error.message, { status: 500 });
    }
}
