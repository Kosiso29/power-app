'use client'

import { configureStore } from "@reduxjs/toolkit";
import schedulesSlice from "./schedules";
import authSlice from "./auth";

const store = configureStore({
    reducer: {
        schedulesReducer: schedulesSlice.reducer,
        authReducer: authSlice.reducer
    }
});

export default store;