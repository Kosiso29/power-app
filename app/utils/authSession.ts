'use client'

import { getCookieByNameEndsWith } from "./getCookies";

const AUTH_TOKEN_KEY = "cyberwatt.idToken";
const AUTH_USERNAME_KEY = "cyberwatt.username";

export function getAuthIdToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return getCookieByNameEndsWith('idToken') || localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUsername() {
    if (typeof window === "undefined") {
        return null;
    }

    return getCookieByNameEndsWith('username') || localStorage.getItem(AUTH_USERNAME_KEY);
}

export function clearAuthSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
}
