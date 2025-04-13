'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter()
    const handleNotesClick = () => router.push('notes')
    return <div className="py-8 w-full flex flex-row items-center justify-between">
        <div className="font-bold text-xl">Finance App</div>
        <div className="flex flex-row gap-6">
            <Image
                src={'/assets/notes.png'}
                alt={'notes'}
                width={36}
                height={36}
                className="cursor-pointer"
                onClick={handleNotesClick}
            />
            <Image
                src={'/assets/notification.png'}
                alt={'notification'}
                width={36}
                height={36}
                className="cursor-pointer"
            />
        </div>
    </div>
}

export default Header;