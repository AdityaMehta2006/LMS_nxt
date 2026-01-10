import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const response = NextResponse.json({ success: true, message: "Logged out successfully" });

        // Remove the userId cookie by expiring it immediately
        response.cookies.set("userId", "", {
            path: "/",
            maxAge: 0,
            expires: new Date(0)
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
