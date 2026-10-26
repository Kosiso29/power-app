import { NextRequest, NextResponse } from "next/server";
import { DEVICE_API_URL } from "@/app/config/api";
import { ID_TOKEN_COOKIE } from "../../auth/cognito";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const idToken = request.cookies.get(ID_TOKEN_COOKIE)?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Session expired. Please sign in again." }, { status: 401 });
    }

    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return NextResponse.json({ message: "Enter a valid Device ID." }, { status: 400 });
    }

    const deviceId = typeof requestBody === "object" && requestBody !== null
        ? String((requestBody as { device_id?: unknown }).device_id ?? "").trim()
        : "";

    if (!deviceId || deviceId.length > 128 || !/^[A-Za-z0-9:_-]+$/.test(deviceId)) {
        return NextResponse.json({ message: "Enter a valid Device ID." }, { status: 400 });
    }

    const claimUrl = `${DEVICE_API_URL.replace(/\/$/, "")}/devices/claim`;

    try {
        const response = await fetch(claimUrl, {
            method: "POST",
            headers: {
                "Authorization": idToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ device_id: deviceId }),
            cache: "no-store",
        });
        const responseBody = await response.text();

        return new NextResponse(responseBody || JSON.stringify({ message: "Device claimed successfully." }), {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch {
        return NextResponse.json({ message: "The device service is currently unavailable." }, { status: 502 });
    }
}
