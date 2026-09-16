'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "@/app/store/auth";
import { getAuthIdToken, getAuthUsername } from "@/app/utils/authSession";

export default function AuthBootstrap() {
    const dispatch = useDispatch();

    useEffect(() => {
        const idToken = getAuthIdToken();
        const username = getAuthUsername();

        if (idToken) {
            dispatch(authActions.updateToken(idToken));
        }

        if (username) {
            dispatch(authActions.updateDeviceId(username));
        }
    }, [dispatch]);

    return null;
}
