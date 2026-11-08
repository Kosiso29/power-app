import { NextRequest, NextResponse } from "next/server";
import { DEVICE_API_URL } from "@/app/config/api";
import { ID_TOKEN_COOKIE } from "../auth/cognito";

export const runtime = "nodejs";

async function proxySchedules(request: NextRequest, method: "GET" | "POST") {
    const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Session expired. Please sign in again." }, { status: 401 });
    }

    try {
        const response = await fetch(`${DEVICE_API_URL.replace(/\/$/, "")}/schedules`, {
            method,
            headers: {
                Authorization: idToken,
                ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
            },
            body: method === "POST" ? await request.text() : undefined,
            cache: "no-store",
        });
        const responseBody = await response.text();

        return new NextResponse(responseBody || JSON.stringify({}), {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch {
        return NextResponse.json({ message: "The schedules service is currently unavailable." }, { status: 502 });
    }
}

export async function GET(request: NextRequest) {
    return proxySchedules(request, "GET");
}

export async function POST(request: NextRequest) {
    return proxySchedules(request, "POST");
}
