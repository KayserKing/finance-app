'use client'

import { MultiSelectFilterDropdown, SearchInput, Topic, TransactionHistoryCard } from "@/components";
import { useDashboardService } from "@/services";
import { formatDate } from "@/utils";
import { useEffect, useState } from "react";

const TransactionHistory = () => {
    const [query, setQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filters, setFilters] = useState<string>('')
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 1500);
        return () => {
            clearTimeout(handler);
        };
    }, [query]);


    const { useGetTransactions } = useDashboardService();
    const { data: getTransactionDetails } = useGetTransactions(`search=${debouncedQuery}&${filters}`);

    return <div>
        <Topic title="TRANSACTION HISTORY" />
        <div className="flex flex-row gap-2">
            <SearchInput onChange={setQuery} value={query} showClear />
            <MultiSelectFilterDropdown onApply={(filter) => {
                const filterString = filter?.map((item: string) => `filters=${item}`).join('&')
                setFilters(filterString)
            }} />
        </div>
        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-280px)]">
            {
                getTransactionDetails?.data?.data?.map((e: { date: string, amount: number, customerId: { name: string }, paymentType: string, transactionType: string }, index: number) => {
                    return <TransactionHistoryCard
                        key={`${e?.date}-${index}`}
                        amount={e?.amount}
                        customerName={e?.customerId?.name}
                        date={formatDate(new Date(e?.date), 'dd-MMM-yyyy')}
                        paymentType={e?.paymentType}
                        type={e?.transactionType}
                    />
                })
            }

        </div>
    </div>
}

export default TransactionHistory;