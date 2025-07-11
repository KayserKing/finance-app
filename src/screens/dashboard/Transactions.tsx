'use client'

import { Topic, TransactionBoard } from "@/components";
import { useDashboardService } from "@/services";
import { formatDate } from "@/utils";
import { useRouter } from "next/navigation";

const Transactions = () => {
    const router = useRouter()
    const { useGetTransactionsSummary, } = useDashboardService();
    const { data: getTransactionDetails } = useGetTransactionsSummary();
    const transactionDetails = getTransactionDetails?.data?.summary || {}
    const todaySummary = transactionDetails['TODAY']
    const weekSummary = transactionDetails['THIS WEEK']
    const monthSummary = transactionDetails['THIS MONTH']
    const yearSummary = transactionDetails['THIS YEAR']

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Sunday

    const getMonthLabel = (date: Date) =>
      new Intl.DateTimeFormat("en-US", { month: "short" })
        .format(date)
        .toUpperCase();

    const getYearLabel = (date: Date) => date.getFullYear().toString();

    function formatAmount(amount: number) {
      return Number(amount % 1 === 0 ? amount : amount?.toFixed(2));
    }

    return <div className="relative">
        <Topic title="TRANSACTIONS" />
        <div className="text-[#004aad] text-[12px] cursor-pointer absolute top-1.5 right-0 hover:underline" onClick={()=>router.push('/transactions/history')}>VIEW ALL</div>
        <div className="flex flex-col gap-4 mb-24">
            <TransactionBoard
                date={formatDate(today, 'dd-MMM-yyyy')}
                receivedAmount={formatAmount(todaySummary?.receivedAmount) || 0}
                title="TODAY"
                yetToReceiveAmount={formatAmount(todaySummary?.yetToReceiveAmount) || 0}
            />
            <TransactionBoard
                date={`${formatDate(startOfWeek, 'dd-MMM-yyyy')} - ${formatDate(endOfWeek, 'dd-MMM-yyyy')}`}
                receivedAmount={formatAmount(weekSummary?.receivedAmount) || 0}
                title="THIS WEEK"
                yetToReceiveAmount={formatAmount(weekSummary?.yetToReceiveAmount) || 0}
            />
            <TransactionBoard
                date={getMonthLabel(today)}
                receivedAmount={formatAmount(monthSummary?.receivedAmount) || 0}
                title="THIS MONTH"
                yetToReceiveAmount={formatAmount(monthSummary?.yetToReceiveAmount) || 0}
            />
            <TransactionBoard
                date={getYearLabel(today)}
                receivedAmount={formatAmount(yearSummary?.receivedAmount) || 0}
                title="THIS YEAR"
                yetToReceiveAmount={formatAmount(yearSummary?.yetToReceiveAmount) || 0}
            />
        </div>
    </div>
}

export default Transactions;