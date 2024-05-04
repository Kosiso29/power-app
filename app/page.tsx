import Button from "./ui/button";
import Link from 'next/link';

export default function Home() {
    return (
        <div className="bg-[url('/powersync-background.jpeg')] bg-center h-screen flex justify-end">
            <div className="flex flex-col justify-center gap-16 items-center text-center w-1/2 shadow-text">
                <div>
                    <h1 className="text-6xl font-bold mb-10">Powersync</h1>
                    <p className="text-lg">Power well managed is power well used, <br />allow us to manage your power!</p>
                </div>
                <Link href="/login">
                    <Button className="px-8 py-3 text-lg border border-[#0e82f6] text-[#0e82f6] hover:border-[#22aaf5] hover:text-[#22aaf5] hover:bg-transparent active:bg-[#b4f8fa] shadow-button">Login</Button>
                </Link>
            </div>
        </div>
    )
}
