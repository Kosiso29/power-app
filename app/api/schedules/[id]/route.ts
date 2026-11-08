import { NextRequest, NextResponse } from "next/server";
import { DEVICE_API_URL } from "@/app/config/api";
import { ID_TOKEN_COOKIE } from "../../auth/cognito";

export const runtime = "nodejs";

type RouteContext = { params: { id: string } };

async function proxySchedule(
    request: NextRequest,
    context: RouteContext,
    method: "GET" | "PUT" | "DELETE",
) {
    const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Session expired. Please sign in again." }, { status: 401 });
    }

    const scheduleId = context.params.id;
    if (!/^SCH-[A-Za-z0-9_-]+$/.test(scheduleId)) {
        return NextResponse.json({ message: "Invalid schedule ID." }, { status: 400 });
    }

    try {
        const response = await fetch(
            `${DEVICE_API_URL.replace(/\/$/, "")}/schedules/${encodeURIComponent(scheduleId)}`,
            {
                method,
                headers: {
                    Authorization: idToken,
                    ...(method === "PUT" ? { "Content-Type": "application/json" } : {}),
                },
                body: method === "PUT" ? await request.text() : undefined,
                cache: "no-store",
            },
        );
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

export async function GET(request: NextRequest, context: RouteContext) {
    return proxySchedule(request, context, "GET");
}

export async function PUT(request: NextRequest, context: RouteContext) {
    return proxySchedule(request, context, "PUT");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    return proxySchedule(request, context, "DELETE");
}
