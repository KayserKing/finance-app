'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

const navItems = [
    { alt: "Customers", src: "/assets/customers.png" },
    { alt: "Transactions", src: "/assets/transactions.png" },
    { alt: "Reports", src: "/assets/reports.png" },
    { alt: "Settings", src: "/assets/settings.png" },
];

const NavBar = () => {
    const router = useRouter();

    return (
        <nav className="sm:pt-8 bg-[#004aad] text-white w-full sm:w-24 h-20 sm:h-screen flex flex-row sm:flex-col items-center justify-around sm:justify-start sm:gap-2 px-4 sm:px-0">
            {navItems.map((item, index) => (
                <div
                    key={`${item.alt}-${index}`}
                    className="max-sm:flex-1 flex sm:w-full sm:h-20 items-center justify-center sm:border-none border-r last:border-none border-white/20"
                >
                    <button
                        aria-label={item.alt}
                        className="cursor-pointer hover:bg-white/10 rounded-md p-2 sm:w-full sm:h-20 flex items-center justify-center transition"
                        onClick={() => router.push(`/${item.alt.toLowerCase()}`)}
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            width={28}
                            height={28}
                        />
                    </button>
                </div>
            ))}
        </nav>
    );
};

export default NavBar;
