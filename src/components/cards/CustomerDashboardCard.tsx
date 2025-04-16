import Image from "next/image";

type TCustomerDashboardCard = {
    title: string;
    days: number;
    loanAmount: number;
    amountPaid: number;
    yetToReceiveAmount: number;
}

const CustomerDashboardCard = ({ title, days, loanAmount, amountPaid, yetToReceiveAmount }: TCustomerDashboardCard) => {
    return <div className="bg-white p-4 max-sm:w-screen max-sm:ml-[-16px]">
        <div className="flex flex-row gap-1 items-bottom ml-6">
            <p className="font-bold">{title}</p>
            <span className={`text-[10px] mt-[6px]  ${days > 100 ? 'text-red-500' : ''}`}>{days} days</span>
        </div>
        <div className="flex flex-row mt-2">
            <div className="flex flex-row w-full border-r-[1px] border-[#004aad] h-10">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/down-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">LOAN AMOUNT</p>
                    <p className="font-bold">₹<span>{loanAmount}</span></p>
                </div>
            </div>
            <div className="flex flex-row pl-2 sm:border-r-[1px] sm:border-[#004aad] w-full h-10">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/up-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">PAID</p>
                    <p className="font-bold">₹<span>{amountPaid}</span></p>
                </div>
            </div>
            <div className="w-full sm:flex pl-2 flex-row h-10 max-sm:hidden">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/up-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">YET TO RECEIVE</p>
                    <p className="font-bold">₹<span>{yetToReceiveAmount}</span></p>
                </div>
            </div>
        </div>
        <div className="w-full mt-4 max-sm:flex max-sm:justify-center hidden">
            <div className="max-sm:flex flex-row h-10 mr-4 hidden">
                <Image width={24} height={24} alt="up-arrow" src={'/assets/down-arrow.png'} className="object-contain mt-2" />
                <div className="flex flex-col">
                    <p className="font-extralight text-[10px]">YET TO RECEIVE</p>
                    <p className="font-bold">₹<span>{yetToReceiveAmount}</span></p>
                </div>
            </div>
        </div>
    </div>
}

export default CustomerDashboardCard;