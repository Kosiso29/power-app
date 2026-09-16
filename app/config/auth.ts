const cookieStorageDomain = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN_DEV
    : process.env.NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN_PROD;

const cookieStorageConfig = cookieStorageDomain ? {
    cookieStorage: {
        domain: cookieStorageDomain,
        path: "/",
        expires: 365,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
    },
} : {};

export const AwsConfigAuth = {
    region: process.env.NEXT_PUBLIC_AUTH_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID,
    ...cookieStorageConfig,
    authenticationFlowType: "USER_SRP_AUTH",
};
