import { NextRequest, NextResponse } from "next/server";
import { DEVICE_API_URL } from "@/app/config/api";
import { ID_TOKEN_COOKIE } from "../auth/cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Session expired. Please sign in again." }, { status: 401 });
    }

    try {
        const devicesUrl = `${DEVICE_API_URL.replace(/\/$/, "")}/devices`;
        const response = await fetch(devicesUrl, {
            method: "GET",
            headers: { "Authorization": idToken },
            cache: "no-store",
        });
        const responseBody = await response.text();

        return new NextResponse(responseBody || JSON.stringify([]), {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch {
        return NextResponse.json({ message: "The device service is currently unavailable." }, { status: 502 });
    }
}
