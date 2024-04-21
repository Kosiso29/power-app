export const AwsConfigAuth = {
    region: process.env.NEXT_PUBLIC_AUTH_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID,
    cookieStorage: {
        domain: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN_DEV : process.env.NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN_PROD,
        path: "/",
        expires: 365,
        sameSite: "strict",
        secure: true,
    },
    authenticationFlowType: "USER_SRP_AUTH",
};
