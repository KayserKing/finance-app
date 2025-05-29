"use client";
import { CustomerCard, TransactionBoard } from "@/components";
import { useDashboardService } from "@/services";
import { formatDate, getNumberOfDaysFrom } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { useGetCustomers, useGetTransactionsSummary } = useDashboardService();
  const { data: customersData, isLoading } = useGetCustomers("");
  const { data: getTransactionDetails } = useGetTransactionsSummary();
  const transactionDetails = getTransactionDetails?.data?.summary || {};
  const todaySummary = transactionDetails["TODAY"];

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div>
      <TransactionBoard
        date={formatDate(new Date(), "dd-mm-yyyy")}
        receivedAmount={todaySummary?.receivedAmount || 0}
        title="TODAY"
        yetToReceiveAmount={todaySummary?.yetToReceiveAmount || 0}
      />
      <div className="mt-4 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-308px)] sm:h-[calc(100vh-240px)]">
        {customersData?.data?.data?.map(
          (
            e: {
              customerName: string;
              name: string;
              mobileNumber: string;
              loanIds: [{ loanAmount: number; loanStartDate: string }];
              amountPaid: number;
              _id: string;
            },
            index: number
          ) => {
            const days = getNumberOfDaysFrom(e?.loanIds[0]?.loanStartDate);
            return (
              <div
                key={`${e.customerName}-${index}`}
                onClick={() => router.push(`/customers/${e._id}`)}
              >
                <CustomerCard
                  key={`${e.customerName}-${index}`}
                  customerName={e.name}
                  customerNumber={e?.mobileNumber}
                  date={
                    e?.loanIds[0]?.loanStartDate
                      ? formatDate(
                          new Date(e?.loanIds[0]?.loanStartDate),
                          "dd-MMM-yyyy"
                        )
                      : formatDate(new Date(), "dd-MMM-yyyy")
                  }
                  loanAmount={
                    e?.loanIds?.length > 0 ? e?.loanIds[0]?.loanAmount : 0
                  }
                  paidAmount={e?.amountPaid || 0}
                  totalDays={days}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Dashboard;
