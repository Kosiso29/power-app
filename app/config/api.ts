export const DEVICE_API_URL = process.env.DEVICE_API_URL
    || process.env.SWITCH_API_URL
    || process.env.NEXT_PUBLIC_SWITCH_API_URL
    || "https://9slw6qo5w3.execute-api.us-east-1.amazonaws.com/prod";

export const DEVICE_ID = process.env.DEVICE_ID
    || process.env.SWITCH_DEVICE_ID
    || "7397048108";

export const SWITCH_API_URL = DEVICE_API_URL;
export const SWITCH_DEVICE_ID = DEVICE_ID;
