import { cookies } from "next/headers";

const ID_TOKEN_COOKIE = "cyberwatt.idToken";

function isTokenActive(token: string) {
    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
        return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function hasActiveSession() {
    const token = cookies().get(ID_TOKEN_COOKIE)?.value;
    return Boolean(token && isTokenActive(token));
}
