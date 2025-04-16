'use client'
import Image from "next/image";

interface TTransactionCard {
    amount: number;
    type: string;
    date: string;
    paymentType: string;
}

const TransactionCard = ({ amount, type, date, paymentType }: TTransactionCard) => {
    return <div className="flex flex-row bg-white px-4 py-2 cursor-pointer transition justify-between">
        <div className="flex flex-row items-end">
            <p className="font-bold text-md">₹{amount}</p>
            <Image width={16} height={16} alt="up-arrow" src={type === "SEND" ? '/assets/down-arrow.png' : '/assets/up-arrow.png'} className="object-contain mb-1" />
            <p className="text-[10px] mb-1">{date}</p>
        </div>
        <div>
            <p className="text-[12px] mt-1">{paymentType}</p>
        </div>
    </div>
}

export default TransactionCard;