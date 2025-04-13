'use client'
import { Button } from "@/components"
import { useRouter } from "next/navigation"

const Add = () => {
    const router = useRouter();
    const handleAddEntryClick = () => router.push('add/entry');
    const handleAddCustomerClick = () => router.push('add/customer');
    return <div className="flex flex-col w-full h-[calc(100vh-200px)] justify-center items-center">
        <div className="flex sm:flex-row flex-col gap-4 sm:gap-6 sm:w-[400px] w-[300px]">
            <Button name="ADD ENTRY" type="button" className="w-full" handleClick={handleAddEntryClick} />
            <Button name="ADD CUSTOMER" type="button" className="w-full" handleClick={handleAddCustomerClick} />
        </div>
    </div>
}

export default Add