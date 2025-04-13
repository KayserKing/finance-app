'use client'
import { useEffect, useRef, useState } from "react";

type TCustomerCard = {
    customerName: string;
    loanAmount: number;
    paidAmount: number;
    date: string;
    totalDays: number;
}

const CustomerCard = ({ customerName, loanAmount, paidAmount, date, totalDays }: TCustomerCard) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const toggleMenu = () => setOpen(!open);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);

    return <div className="flex flex-row justify-between bg-white px-4 py-2 cursor-pointer transition">
        <div>
            <p className="font-bold text-sm">{customerName}</p>
            <div className="text-[10px]">LOAN: ₹<span>{loanAmount}</span></div>
            <div className="text-[10px]">PAID: ₹<span>{paidAmount}</span></div>
        </div>
        <div className="flex flex-row items-center">
            <div className="text-center">
                <p className="text-[10px]">{date}</p>
                <p className={`text-[10px] ${totalDays > 100 ? 'text-red-500' : ''}`}>{totalDays} days</p>
            </div>
            <div className="relative inline-block text-left">
                <button onClick={toggleMenu} className="px-4 flex items-center justify-center w-4 rounded-full hover:bg-gray-200 cursor-pointer">
                    <span className="text-2xl font-bold">⋮</span>
                </button>

                {open && (
                    <div ref={popupRef} className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-opacity-5">
                        <div className="py-1">
                            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer">Notify</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
}

export default CustomerCard;