import Button from "./ui/button";
import Link from 'next/link';
import Image from "next/image";

export default function Home() {
    return (
        <div className="bg-[#080c1c] lg:bg-[url('/powersync-background.jpeg')] bg-center h-screen lg:flex lg:justify-end">
            <div className="lg:hidden max-h-[60vh] h-[60vh]">
                <Image src="/mobile-home-background.jpeg" className="block max-h-full" fill style={{ maxHeight: "60vh" }} objectFit="cover" alt="bg" />
            </div>
            <div className="flex flex-col justify-center gap-16 items-center text-center h-[40vh] lg:h-auto lg:w-1/2 shadow-text">
                <div>
                    <h1 className="text-6xl font-bold mb-10">Powersync</h1>
                    <p className="text-lg">Power well managed is power well used. <br />Allow us to manage your power!</p>
                </div>
                <Link href="/login">
                    <Button className="px-8 py-3 text-lg border border-[#0e82f6] text-[#0e82f6] hover:border-[#22aaf5] hover:text-[#22aaf5] hover:bg-transparent active:bg-[#b4f8fa] shadow-button">Login</Button>
                </Link>
            </div>
        </div>
    )
}
