"use client";
import {
  Button,
  CustomerDashboardCard,
  Topic,
  TransactionCard,
} from "@/components";
import { useDashboardService } from "@/services";
import { formatDate, getNumberOfDaysFrom } from "@/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker, getDefaultClassNames, Modifiers } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "react-toastify";
import { ErrorResponse } from "./schema";

type ReportResponse = {
  data: {
    filePath: string;
  };
};

const CustomerDetails = () => {
  const pathname = usePathname();
  const defaultClassNames = getDefaultClassNames();
  const customerId = pathname?.split("/")[2] || "";
  const [loading, setLoading] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const { useGetCustomerById, useDownloadReport, useDownloadDelete } =
    useDashboardService();
  const { mutate: downloadDeleteMutate } = useDownloadDelete();
  const { mutate: downloadReportMutate } = useDownloadReport({
    onSuccess: async (res: unknown) => {
      const resData = res as ReportResponse;
      const link = document.createElement("a");
      link.href = resData?.data?.filePath;
      link.setAttribute("download", "report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      downloadDeleteMutate();
      toast.success("Report download successful");
    },
    onError: (error: unknown) => {
      const err = error as ErrorResponse;
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error("Download error:", error);
    },
  });
  const { data: getCustomerDetails, isLoading } =
    useGetCustomerById(customerId);
  const customerDetails = getCustomerDetails?.data?.data?.customer || {};
  const transactionDetails = getCustomerDetails?.data?.data?.transactions || [];
  const paymentDetails = getCustomerDetails?.data?.data?.payments || [];
  const loanDetails =
    getCustomerDetails?.data?.data?.customer?.loanIds?.[0] || {};
  const TotalLoandaysCount = getNumberOfDaysFrom(loanDetails?.loanStartDate);
  const totalLoanDates = getDatesFromLoanStartToToday(
    loanDetails.loanStartDate
  );
  const transactionDates = getReceiveTransactionDates(transactionDetails);
  const delayedPaymentsDates = getPaymentsDates(paymentDetails);
  const last10Transactions = transactionDetails?.reverse();
  const paidAmountMap = new Map(
    transactionDetails
      .filter(
        (t: { transactionType: string }) => t.transactionType === "RECEIVE"
      )
      .map((t: { date: string; amount: number; paymentType: string }) => [
        new Date(t.date).toDateString(),
        { amount: t.amount, type: t.paymentType },
      ])
  );

  const formatTransactionDate = (date: Date) => date.toDateString();
  const remainingDates = totalLoanDates.filter(
    (date) =>
      !new Set([
        ...transactionDates.map(formatTransactionDate),
        ...delayedPaymentsDates.map(formatTransactionDate),
      ]).has(formatTransactionDate(date))
  );

  const handleDayClick = (
    date: Date,
    modifiers: Modifiers,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    const paidData = paidAmountMap.get(date.toDateString()) as {
      amount: number;
      type: string;
    };

    if (modifiers) {
      selectedDates?.shift(); // dummy
    }

    if ("currentTarget" in e && e.currentTarget instanceof HTMLElement) {
      const rect = e.currentTarget.getBoundingClientRect();

      setTooltip({
        text: paidData
          ? `Paid ₹${paidData.amount} in ${paidData.type}`
          : "No payment",
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top - 10 + window.scrollY,
      });

      setTimeout(() => setTooltip(null), 2500);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-380px)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleDownloadClick = () => {
    downloadReportMutate({
      type: "CUSTOMER BASED",
      customerId: `${customerDetails?.name} - ${customerDetails?.mobileNumber}`,
      range: "FULL",
    });
  };

  const handleCallClick = () =>
    (window.location.href = `tel:+91${customerDetails?.mobileNumber}`);

  return (
    <div className="max-sm:mb-24">
      <Topic title="CUSTOMERS" />
      <CustomerDashboardCard
        amountPaid={customerDetails?.amountPaid}
        days={TotalLoandaysCount}
        loanAmount={loanDetails?.loanAmount || 0}
        title={customerDetails?.name}
        yetToReceiveAmount={
          loanDetails?.loanAmount - customerDetails?.amountPaid || 0
        }
      />
      <div className="relative flex flex-row max-sm:justify-around justify-end sm:gap-4 pb-4 bg-white max-sm:w-screen max-sm:ml-[-16px] sm:pr-6">
        <Button
          handleClick={handleCallClick}
          name="CALL"
          type="button"
          className="px-2 h-full sm:px-4 w-[90px] sm:w-[150] sm:text-sm text-[12px] !py-1 sm:!py-2"
        />
        <a
          href={`sms:+91${customerDetails?.mobileNumber}?body=Hello%20${customerDetails?.name},%0AYou%20have%20missed%20your%20payment,%20please%20pay%20now!!`}
        >
          <Button
            name="MESSAGE"
            type="button"
            className="px-2 h-full sm:px-4 w-[90px] sm:w-[150] sm:text-sm text-[12px]  !py-1"
          />
        </a>
        <Button
          handleClick={handleDownloadClick}
          name="DOWNLOAD"
          type="button"
          className="px-2 sm:px-4 w-[90px] sm:w-[150] sm:text-sm text-[12px]  !py-1"
        />
      </div>
      {last10Transactions?.length == 0 && (
        <div className="font-bold py-2">
          No Money is given to this person yet
        </div>
      )}
      <div className="flex flex-col sm:flex-row w-full mt-2">
        <div className="flex justify-center w-full sm:mt-10">
          {totalLoanDates?.length > 0 && !loading && (
            <DayPicker
              animate
              mode="multiple"
              min={2}
              max={5}
              selected={totalLoanDates}
              onSelect={setSelectedDates}
              onDayClick={handleDayClick}
              classNames={{
                today: ``,
                selected: `inset-ring-2 inset-ring-[#004aad] text-[#004aad] font-bold rounded-full`,
                nav: `${defaultClassNames.nav} !fill-[#004aad]`,
                root: `${defaultClassNames.root}`,
                chevron: `${defaultClassNames.chevron} fill-amber-500`,
                disabled: `opacity-100`,
              }}
              required={true}
              modifiers={{
                paymentMade: transactionDates,
                delayed: delayedPaymentsDates,
                missed: remainingDates,
              }}
              modifiersClassNames={{
                paymentMade: "bg-green-500",
                delayed: "bg-yellow-500",
                missed: "bg-red-400",
              }}
            />
          )}
        </div>
        <div className="w-full">
          {last10Transactions?.length > 0 && (
            <p className="font-bold">Transactions History</p>
          )}
          <div className="flex flex-col gap-3 mt-3">
            {last10Transactions?.map(
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
          </div>
        </div>
      </div>
      {tooltip && (
        <div
          className="absolute bg-[#004aad] font-bold text-white text-sm rounded px-2 py-1"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

type TTransaction = {
  amount: number;
  transactionType: "RECEIVE" | "SEND";
  date: string;
};

type TPayment = {
  amount: number;
  paymentTier: "LOW" | "HIGH";
  date: string;
};

export function getReceiveTransactionDates(
  transactions: TTransaction[]
): Date[] {
  return transactions
    .filter((t) => t.transactionType === "RECEIVE")
    .map((t) => {
      const date = new Date(t.date);
      date.setHours(0, 0, 0, 0);
      return date;
    });
}

export function getPaymentsDates(payments: TPayment[]): Date[] {
  return payments.map((t) => {
    const date = new Date(t.date);
    date.setHours(0, 0, 0, 0);
    return date;
  });
}

export function getDatesFromLoanStartToToday(
  loanStartDate: string | Date
): Date[] {
  const start = new Date(loanStartDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  while (start <= today) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return dates;
}
