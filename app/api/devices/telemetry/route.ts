import { NextRequest, NextResponse } from "next/server";
import { DEVICE_API_URL, DEVICE_ID } from "@/app/config/api";
import { ID_TOKEN_COOKIE } from "../../auth/cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Session expired. Please sign in again." }, { status: 401 });
    }

    const telemetryUrl = `${DEVICE_API_URL.replace(/\/$/, "")}/devices/${encodeURIComponent(DEVICE_ID)}/telemetry`;

    const response = await fetch(telemetryUrl, {
        method: "GET",
        headers: {
            "Authorization": idToken,
        },
        cache: "no-store",
    });
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
        status: response.status,
        headers: {
            "Content-Type": response.headers.get("content-type") || "application/json",
        },
    });
}
