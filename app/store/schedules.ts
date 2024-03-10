'use client'

import { configureStore, createSlice } from "@reduxjs/toolkit";

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

const store = configureStore({ reducer: { schedulesReducer: schedulesSlice.reducer } })

export const schedulesActions = schedulesSlice.actions;

export default store;