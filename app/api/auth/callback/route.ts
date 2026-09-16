import { NextRequest, NextResponse } from "next/server";
import {
    clearOauthCookies,
    getBasicAuthHeader,
    getCognitoAuthConfig,
    getNonceFromIdToken,
    getOauthCookies,
    getOpenIdConfiguration,
    getUsernameFromIdToken,
    redirectToLoginError,
    setSessionCookies,
} from "../cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const error = request.nextUrl.searchParams.get("error");

    if (error) {
        return redirectToLoginError(request, request.nextUrl.searchParams.get("error_description") || error);
    }

    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const oauthCookies = getOauthCookies(request);

    if (!code || !state || state !== oauthCookies.state || !oauthCookies.codeVerifier || !oauthCookies.redirectUri) {
        return redirectToLoginError(request, "Cognito login could not be verified. Please try again.");
    }

    try {
        const config = getCognitoAuthConfig(request.nextUrl.origin);
        const openIdConfig = await getOpenIdConfiguration(config.issuer);

        if (!openIdConfig.token_endpoint) {
            throw new Error("Cognito token endpoint was not found.");
        }

        if (!config.clientSecret) {
            throw new Error("Cognito token exchange is not configured. Set AUTH_CLIENT_SECRET.");
        }

        const tokenResponse = await fetch(openIdConfig.token_endpoint, {
            method: "POST",
            headers: {
                "Authorization": getBasicAuthHeader(config.clientId, config.clientSecret),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: config.clientId,
                code,
                redirect_uri: oauthCookies.redirectUri,
                code_verifier: oauthCookies.codeVerifier,
            }).toString(),
            cache: "no-store",
        });
        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokens.error_description || tokens.error || "Cognito token exchange failed.");
        }

        if (!tokens.id_token) {
            throw new Error("Cognito did not return an ID token.");
        }

        const tokenNonce = getNonceFromIdToken(tokens.id_token);

        if (oauthCookies.nonce && tokenNonce && tokenNonce !== oauthCookies.nonce) {
            throw new Error("Cognito login nonce validation failed.");
        }

        const response = NextResponse.redirect(new URL("/dashboard", request.url));
        setSessionCookies(response, {
            idToken: tokens.id_token,
            username: getUsernameFromIdToken(tokens.id_token),
            maxAge: tokens.expires_in,
        });
        clearOauthCookies(response);

        return response;
    } catch (error: any) {
        const response = redirectToLoginError(request, error?.message || "Unable to complete Cognito login.");
        clearOauthCookies(response);
        return response;
    }
}
