import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ID_TOKEN_COOKIE = "cyberwatt.idToken";
export const USERNAME_COOKIE = "cyberwatt.username";

const OAUTH_STATE_COOKIE = "cyberwatt.oauthState";
const OAUTH_NONCE_COOKIE = "cyberwatt.oauthNonce";
const OAUTH_VERIFIER_COOKIE = "cyberwatt.oauthVerifier";
const OAUTH_REDIRECT_COOKIE = "cyberwatt.oauthRedirectUri";
const OAUTH_COOKIE_MAX_AGE = 10 * 60;

type OpenIdConfiguration = {
    authorization_endpoint?: string;
    token_endpoint?: string;
    end_session_endpoint?: string;
};

type CognitoAuthConfig = {
    region: string;
    userPoolId: string;
    clientId: string;
    clientSecret?: string;
    issuer: string;
    redirectUri: string;
    logoutUri: string;
    scope: string;
};

export function getCognitoAuthConfig(origin: string): CognitoAuthConfig {
    const region = process.env.AUTH_REGION || process.env.NEXT_PUBLIC_AUTH_REGION;
    const userPoolId = process.env.AUTH_USER_POOL_ID || process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID;
    const clientId = process.env.AUTH_USER_POOL_WEB_CLIENT_ID || process.env.NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID;
    const clientSecret = process.env.AUTH_CLIENT_SECRET;
    const redirectUri = process.env.AUTH_REDIRECT_URI || `${origin}/api/auth/callback`;
    const logoutUri = process.env.AUTH_LOGOUT_URI || origin;

    if (!region || !userPoolId || !clientId) {
        throw new Error("Cognito Hosted UI is not configured.");
    }

    return {
        region,
        userPoolId,
        clientId,
        clientSecret,
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        redirectUri,
        logoutUri,
        scope: process.env.AUTH_SCOPES || "openid",
    };
}

export async function getOpenIdConfiguration(issuer: string): Promise<OpenIdConfiguration> {
    const response = await fetch(`${issuer}/.well-known/openid-configuration`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load Cognito OpenID configuration.");
    }

    return response.json();
}

export function randomBase64Url(bytes = 32) {
    return randomBytes(bytes).toString("base64url");
}

export function getCodeChallenge(codeVerifier: string) {
    return createHash("sha256").update(codeVerifier).digest("base64url");
}

export function getBasicAuthHeader(clientId: string, clientSecret: string) {
    return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

export function getUsernameFromIdToken(idToken: string) {
    try {
        const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
        return payload["cognito:username"] || payload.username || payload.email || payload.sub || "";
    } catch {
        return "";
    }
}

export function getNonceFromIdToken(idToken: string) {
    try {
        const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
        return payload.nonce || "";
    } catch {
        return "";
    }
}

export function getOauthCookies(request: NextRequest) {
    return {
        state: request.cookies.get(OAUTH_STATE_COOKIE)?.value,
        nonce: request.cookies.get(OAUTH_NONCE_COOKIE)?.value,
        codeVerifier: request.cookies.get(OAUTH_VERIFIER_COOKIE)?.value,
        redirectUri: request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value,
    };
}

export function setOauthCookies(response: NextResponse, values: { state: string, nonce: string, codeVerifier: string, redirectUri: string }) {
    const options = getCookieOptions(true, OAUTH_COOKIE_MAX_AGE);

    response.cookies.set(OAUTH_STATE_COOKIE, values.state, options);
    response.cookies.set(OAUTH_NONCE_COOKIE, values.nonce, options);
    response.cookies.set(OAUTH_VERIFIER_COOKIE, values.codeVerifier, options);
    response.cookies.set(OAUTH_REDIRECT_COOKIE, values.redirectUri, options);
}

export function clearOauthCookies(response: NextResponse) {
    response.cookies.delete(OAUTH_STATE_COOKIE);
    response.cookies.delete(OAUTH_NONCE_COOKIE);
    response.cookies.delete(OAUTH_VERIFIER_COOKIE);
    response.cookies.delete(OAUTH_REDIRECT_COOKIE);
}

export function setSessionCookies(response: NextResponse, values: { idToken: string, username?: string, maxAge?: number }) {
    const options = getCookieOptions(false, values.maxAge || 60 * 60);

    response.cookies.set(ID_TOKEN_COOKIE, values.idToken, options);

    if (values.username) {
        response.cookies.set(USERNAME_COOKIE, values.username, options);
    }
}

export function clearSessionCookies(response: NextResponse) {
    response.cookies.delete(ID_TOKEN_COOKIE);
    response.cookies.delete(USERNAME_COOKIE);
}

export function redirectToLoginError(request: NextRequest, message: string) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url);
}

function getCookieOptions(httpOnly: boolean, maxAge?: number) {
    return {
        httpOnly,
        maxAge,
        path: "/",
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
    };
}
