'use client'

import {
  DateRangeSelector,
  MultiSelectFilterDropdown,
  SearchInput,
  Topic,
  TransactionHistoryCard
} from "@/components";
import { useDashboardService } from "@/services";
import { formatDate } from "@/utils";
import { useEffect, useMemo, useState } from "react";

const TransactionHistory = () => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // faster debounce
    return () => clearTimeout(handler);
  }, [query]);

  // Combine query string
  const queryString = useMemo(() => {
    const parts: string[] = [];

    if (debouncedQuery) parts.push(`search=${debouncedQuery}`);
    filters.forEach(f => parts.push(`filters=${f}`));
    if (startDate) parts.push(`start=${startDate}`);
    if (endDate) parts.push(`end=${endDate}`);

    return parts.join('&');
  }, [debouncedQuery, filters, startDate, endDate]);

  // Call API
  const { useGetTransactions } = useDashboardService();
  const { data: getTransactionDetails } = useGetTransactions(queryString);

  return (
    <div>
      <Topic title="TRANSACTION HISTORY" />

      <div className="flex flex-row gap-2 items-center">
        <SearchInput onChange={setQuery} value={query} showClear />

        <MultiSelectFilterDropdown
          onApply={(filter) => {
            setFilters(filter || []);
          }}
        />

        <DateRangeSelector
          onApply={({ from, to }) => {
            if (from && to) {
              setStartDate(from.toISOString());
              setEndDate(to.toISOString());
            } else if (from) {
              const start = from.toISOString();
              setStartDate(start);
              setEndDate(null);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-280px)]">
        {getTransactionDetails?.data?.data?.map(
          (
            e: {
              date: string;
              amount: number;
              customerId: { name: string };
              paymentType: string;
              transactionType: string;
            },
            index: number
          ) => (
            <TransactionHistoryCard
              key={`${e?.date}-${index}`}
              amount={e?.amount}
              customerName={e?.customerId?.name}
              date={formatDate(new Date(e?.date), "dd-MMM-yyyy")}
              paymentType={e?.paymentType}
              type={e?.transactionType}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
