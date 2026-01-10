import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const { unitId, newTitle } = await req.json();

        if (!unitId || !newTitle) {
            return NextResponse.json({ error: "Missing unitId or newTitle" }, { status: 400 });
        }

        const updatedUnit = await prisma.courseSection.update({
            where: { id: parseInt(unitId) },
            data: { title: newTitle },
        });

        return NextResponse.json(updatedUnit);
    } catch (error) {
        console.error("Error updating unit:", error);
        return NextResponse.json({ error: "Failed to update unit" }, { status: 500 });
    }
}
