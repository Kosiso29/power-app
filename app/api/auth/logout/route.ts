import { NextRequest, NextResponse } from "next/server";
import {
    clearOauthCookies,
    clearSessionCookies,
    getCognitoAuthConfig,
    getOpenIdConfiguration,
} from "../cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const fallbackResponse = NextResponse.redirect(new URL("/", request.url));

    clearOauthCookies(fallbackResponse);
    clearSessionCookies(fallbackResponse);

    try {
        const config = getCognitoAuthConfig(request.nextUrl.origin);
        const openIdConfig = await getOpenIdConfiguration(config.issuer);

        if (!openIdConfig.end_session_endpoint) {
            return fallbackResponse;
        }

        const logoutUrl = new URL(openIdConfig.end_session_endpoint);
        logoutUrl.searchParams.set("client_id", config.clientId);
        logoutUrl.searchParams.set("logout_uri", config.logoutUri);

        const response = NextResponse.redirect(logoutUrl);
        clearOauthCookies(response);
        clearSessionCookies(response);

        return response;
    } catch {
        return fallbackResponse;
    }
}
