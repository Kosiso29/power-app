import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./store/provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthBootstrap from "./components/auth-bootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Cyberwatt",
    description: "App for tracking power usage",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <AuthBootstrap />
                    {children}
                </Providers>
                <ToastContainer autoClose={3500} position="top-right" />
            </body>
        </html>
    );
}
