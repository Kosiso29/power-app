'use client'

import { createSlice } from "@reduxjs/toolkit";

const schedulesSlice = createSlice({
    name: 'schedules',
    initialState: {
        schedules: []
    },
    reducers: {
        updateSchedules(state, actions) {
            const schedules = actions.payload;
            if (schedules) {
                state.schedules = schedules;
            }
        },
    }
});



export const schedulesActions = schedulesSlice.actions;

export default schedulesSlice;