import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { topicId, feedback } = await req.json();

        if (!topicId || !feedback) {
            return NextResponse.json({ error: "Topic ID and feedback are required" }, { status: 400 });
        }

        const updatedTopic = await prisma.contentItem.update({
            where: { id: parseInt(topicId) },
            data: {
                workflowStatus: "Editing", // Send back to Editor
                reviewNotes: feedback,
                reviewRequestAt: null // Reset review request
            }
        });

        return NextResponse.json({ success: true, topic: updatedTopic });
    } catch (error) {
        console.error("Error rejecting video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
