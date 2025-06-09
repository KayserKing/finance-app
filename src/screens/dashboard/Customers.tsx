"use client";

import {
  CustomerCard,
  CustomerFilterTabs,
  SearchInput,
  Topic,
} from "@/components";
import { useDashboardService } from "@/services";
import { formatDate, getNumberOfDaysFrom } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Customers = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1500);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);
  const [selected, setSelected] = useState("ALL");
  const { useGetCustomers } = useDashboardService();
  const { data: customersData, isLoading } = useGetCustomers(
    `search=${debouncedQuery}&filter=${selected.toLowerCase()}`
  );
  return (
    <div>
      <Topic title="CUSTOMERS" />
      <div className="flex max-sm:flex-col flex-row">
        <SearchInput onChange={setQuery} value={query} />
        <div className="w-full text-right mt-2">
          <CustomerFilterTabs selected={selected} setSelected={setSelected} />
        </div>
      </div>
      {!isLoading ? (
        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-308px)] sm:h-[calc(100vh-240px)]">
          {customersData?.data?.data?.map(
            (
              e: {
                _id: string;
                customerName: string;
                name: string;
                mobileNumber: string;
                loanIds: [{ loanAmount: number; loanStartDate: string }];
                amountPaid: number;
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
                    customerId={e._id}
                    customerName={e.name}
                    customerNumber={e.mobileNumber}
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
      ) : (
        <div className="h-[calc(100vh-380px)] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Customers;
