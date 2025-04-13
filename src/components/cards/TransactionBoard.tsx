import Image from "next/image";

type TTransactionBoard = {
    title: string;
    date: string;
    receivedAmount: number;
    yetToReceiveAmount: number;
}

const TransactionBoard = ({ title, date, receivedAmount, yetToReceiveAmount }: TTransactionBoard) => {
    return <div className="bg-white p-4 max-sm:w-screen max-sm:ml-[-16px]">
        <div className="flex flex-row gap-1 items-bottom ml-6">
            <p className="font-bold">{title}</p>
            <span className="text-[10px] mt-[6px]">{date}</span>
        </div>
        <div className="flex flex-row mt-2">
            <div className="flex flex-row w-full border-r-[1px] border-[#004aad] h-10">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/up-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">RECEIVED</p>
                    <p className="font-bold">₹<span>{receivedAmount}</span></p>
                </div>
            </div>
            <div className="flex flex-row pl-2 w-full h-10">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/down-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">YET TO RECEIVE</p>
                    <p className="font-bold">₹<span>{yetToReceiveAmount}</span></p>
                </div>
            </div>
        </div>
    </div>
}

export default TransactionBoard;