import { NextRequest, NextResponse } from "next/server";
import {
    getCodeChallenge,
    getCognitoAuthConfig,
    getOpenIdConfiguration,
    randomBase64Url,
    redirectToLoginError,
    setOauthCookies,
} from "../cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const config = getCognitoAuthConfig(request.nextUrl.origin);
        const openIdConfig = await getOpenIdConfiguration(config.issuer);
        const authorizationEndpoint = openIdConfig.authorization_endpoint;

        if (!authorizationEndpoint) {
            throw new Error("Cognito Hosted UI authorization endpoint was not found.");
        }

        const state = randomBase64Url();
        const nonce = randomBase64Url();
        const codeVerifier = randomBase64Url(64);
        const authorizationUrl = new URL(authorizationEndpoint);

        authorizationUrl.searchParams.set("client_id", config.clientId);
        authorizationUrl.searchParams.set("response_type", "code");
        authorizationUrl.searchParams.set("scope", config.scope);
        authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
        authorizationUrl.searchParams.set("state", state);
        authorizationUrl.searchParams.set("nonce", nonce);
        authorizationUrl.searchParams.set("code_challenge", getCodeChallenge(codeVerifier));
        authorizationUrl.searchParams.set("code_challenge_method", "S256");

        const response = NextResponse.redirect(authorizationUrl);
        setOauthCookies(response, { state, nonce, codeVerifier, redirectUri: config.redirectUri });

        return response;
    } catch (error: any) {
        return redirectToLoginError(request, error?.message || "Unable to start Cognito login.");
    }
}
