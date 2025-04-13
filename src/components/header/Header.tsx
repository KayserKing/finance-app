'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../buttons";

const Header = () => {
    const router = useRouter()
    const handleNotesClick = () => router.push('/notes')
    const handleAddCustomerClick = () => router.push('/add')
    return <div className="py-8 w-full flex flex-row items-center justify-between">
        <div className="font-bold text-xl cursor-pointer" onClick={() => router.push('/')}>Finance App</div>
        <div className="flex flex-row gap-6">
            <div className="hidden sm:block">
                <Button handleClick={handleAddCustomerClick} name="ADD" type={'button'} className="px-4 text-sm" />
            </div>
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
        <div className="sm:hidden fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50">
            <button
                className="w-16 h-16 border-white border-2 rounded-full bg-[#004aad] text-white text-3xl shadow-md flex items-center justify-center"
                onClick={handleAddCustomerClick}
                aria-label="Add Customer"
            >
                +
            </button>
        </div>
    </div>
}

export default Header;