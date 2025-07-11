'use client';
import { TransactionCard } from "@/components";
import { useDashboardService } from "@/services";
import { formatDate } from "@/utils";
import { usePathname } from "next/navigation";

const Customer = () => {
  const pathname = usePathname();
  const customerId = pathname?.split("/")[2] || "";
    const { useGetCustomerById } =
    useDashboardService();
    const { data: getCustomerDetails } =
    useGetCustomerById(customerId);
    const transactionDetails = getCustomerDetails?.data?.data?.transactions || [];
    const allTransactions = transactionDetails?.reverse();
    return <div className="p-4">
      <p className="font-bold">Hi, {getCustomerDetails?.data?.data?.customer?.name?.toUpperCase()}</p>
      <p className="font-bold">YOUR TRANSACTION</p>
      <div className="flex flex-col gap-3 mt-3">
            {allTransactions?.map(
              (
                e: {
                  amount: number;
                  transactionType: string;
                  date: Date;
                  paymentType: string;
                },
                index: number
              ) => (
                <div key={`${e?.amount}-${index}`}>
                  <TransactionCard
                    amount={e?.amount || 0}
                    date={formatDate(new Date(e?.date), "dd-MMM-yyyy")}
                    type={e?.transactionType}
                    paymentType={e?.paymentType}
                  />
                </div>
              )
            )}
          </div></div>
}

export default Customer;