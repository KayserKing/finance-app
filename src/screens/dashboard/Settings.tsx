'use client'
import { Button, Topic } from "@/components";
import { ACCESS_TOKEN_COOKIE } from "@/utils";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Settings = () => {
    const router = useRouter();
    const handleClick = () => {
        Cookies.remove(ACCESS_TOKEN_COOKIE);
        router.push('/login')
    }

    const handleChangePassword = () => {
        router.push('/change-password')
    }

    const handleNotificationPref = () => {
        toast.error('This feature is getting ready!')
    }
    return <div>
        <Topic title="SETTINGS" />
        <div className="flex flex-col">
            <button
                onClick={handleChangePassword}
                className="w-full text-left border-y-[1px] py-4 border-[#004aad] cursor-pointer transition"
            >
                CHANGE PASSWORD
            </button>
            <button
                onClick={handleNotificationPref}
                className="w-full text-left border-b-[1px] py-4 border-[#004aad] cursor-pointer transition"
            >
                NOTIFICATION PREFERENCES
            </button>
            <Button name="LOG OUT" type="button" handleClick={handleClick} className="mt-4 max-sm:w-full w-[200px]" />
        </div>
    </div>
}

export default Settings;