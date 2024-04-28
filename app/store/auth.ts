'use client'

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        deviceId: null
    },
    reducers: {
        updateToken(state, actions) {
            const token = actions.payload;
            if (token) {
                state.token = token;
            }
        },
        updateDeviceId(state, actions) {
            const deviceId = actions.payload;
            if (deviceId) {
                state.deviceId = deviceId;
            }
        },
    }
});



export const authActions = authSlice.actions;

export default authSlice;