import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const { topicId, newTitle } = await req.json();

        if (!topicId || !newTitle) {
            return NextResponse.json({ error: "Missing topicId or newTitle" }, { status: 400 });
        }

        const updatedTopic = await prisma.contentItem.update({
            where: { id: parseInt(topicId) },
            data: { title: newTitle },
        });

        return NextResponse.json(updatedTopic);
    } catch (error) {
        console.error("Error updating topic:", error);
        return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
    }
}
