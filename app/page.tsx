import { redirect } from "next/navigation";
import { hasActiveSession } from "./utils/serverAuth";

export default function Home({ searchParams }: { searchParams?: { code?: string, state?: string, error?: string, error_description?: string } }) {
    if (searchParams?.code || searchParams?.error) {
        const params = new URLSearchParams();

        if (searchParams.code) {
            params.set("code", searchParams.code);
        }

        if (searchParams.state) {
            params.set("state", searchParams.state);
        }

        if (searchParams.error) {
            params.set("error", searchParams.error);
        }

        if (searchParams.error_description) {
            params.set("error_description", searchParams.error_description);
        }

        redirect(`/api/auth/callback?${params.toString()}`);
    }

    redirect(hasActiveSession() ? "/dashboard" : "/login");
}
