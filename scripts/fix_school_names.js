const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    const wrongName = "School of Management";
    const correctName = "School of Commerce, Finance and Accountancy";

    console.log(`Checking for schools: "${wrongName}" and "${correctName}"...`);

    const schoolWrong = await prisma.school.findUnique({ where: { name: wrongName } });
    const schoolCorrect = await prisma.school.findUnique({ where: { name: correctName } });

    if (!schoolWrong) {
        console.log(`"${wrongName}" not found. No action needed.`);
        return;
    }

    if (!schoolCorrect) {
        console.log(`Only "${wrongName}" found. Renaming to "${correctName}"...`);
        await prisma.school.update({
            where: { id: schoolWrong.id },
            data: { name: correctName }
        });
        console.log("Renamed successfully.");
        return;
    }

    console.log(`Both schools found. Merging "${wrongName}" (ID: ${schoolWrong.id}) into "${correctName}" (ID: ${schoolCorrect.id})...`);

    // 1. Move Programs
    const updatePrograms = await prisma.program.updateMany({
        where: { schoolId: schoolWrong.id },
        data: { schoolId: schoolCorrect.id }
    });
    console.log(`Moved ${updatePrograms.count} programs.`);

    // 2. Move Users
    const updateUsers = await prisma.user.updateMany({
        where: { schoolId: schoolWrong.id },
        data: { schoolId: schoolCorrect.id }
    });
    console.log(`Moved ${updateUsers.count} users.`);

    // 3. Delete the wrong school
    await prisma.school.delete({
        where: { id: schoolWrong.id }
    });
    console.log(`Deleted "${wrongName}". Merge complete.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
