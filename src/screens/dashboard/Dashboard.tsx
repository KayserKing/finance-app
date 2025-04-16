'use client'
import { CustomerCard, TransactionBoard } from "@/components";
import { useDashboardService } from "@/services";
import { formatDate, getNumberOfDaysFrom } from "@/utils";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const { useGetCustomers, useGetTransactions } = useDashboardService();
  const { data: customersData, isLoading } = useGetCustomers('');
  const { data: getTransactions } = useGetTransactions('period=day');
  const transactionsList = getTransactions?.data?.data || []

  const totalReceivedAmount = transactionsList
    ?.filter((e: { transactionType: string }) => e.transactionType === 'RECEIVE')
    ?.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

  const totalAmountYetToReceive = customersData?.data?.data?.reduce((sum: number, customer: { active: boolean, loanIds: [{ dailyAmountToBePaid: number }] }) => {
    const isActive = customer?.active;
    const dailyAmount = customer?.loanIds?.[0]?.dailyAmountToBePaid || 0;
    if (isActive) {
      return sum + dailyAmount;
    }
    return sum;
  }, 0);

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return <div>
    <TransactionBoard date={formatDate(new Date(), 'dd-mm-yyyy')} receivedAmount={totalReceivedAmount || 0} title="TODAY" yetToReceiveAmount={totalAmountYetToReceive - totalReceivedAmount || 0} />
    <div className="mt-4 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-308px)] sm:h-[calc(100vh-240px)]">
      {customersData?.data?.data?.map((e: {
        customerName: string;
        name: string;
        loanIds: [{ loanAmount: number, loanStartDate: string }];
        amountPaid: number;
      }, index: number) => {
        const days = getNumberOfDaysFrom(e?.loanIds[0]?.loanStartDate);
        return <CustomerCard
          key={`${e.customerName}-${index}`}
          customerName={e.name}
          date={formatDate(new Date(e?.loanIds[0]?.loanStartDate), 'dd-MMM-yyyy')}
          loanAmount={e?.loanIds?.length > 0 ? e?.loanIds[0]?.loanAmount : 0}
          paidAmount={e?.amountPaid || 0}
          totalDays={days}
        />
      })}
    </div>
  </div>
}

export default Dashboard;