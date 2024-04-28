'use client'

import { Provider } from "react-redux";
import store from ".";

export const Providers = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
        {children}
    </Provider>
)