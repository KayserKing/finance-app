import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { CREATE_CUSTOMER, CREATE_LOAN, CREATE_TRANSACTIONS, DOWNLOAD_REPORT, GET_CUSTOMER, GET_CUSTOMER_BY_ID, GET_NOTES, GET_TRANSACTION_SUMMARY, GET_TRANSACTIONS, NOTES } from "@/utils";
import { TCreateCustomerPayload, TCreateLoanPayload, TDownloadReportPayload, TNotesPayload } from "./types";
import dashboardService from "./dashboard";

type UseNotesOptions = UseMutationOptions<unknown, Error, TNotesPayload>;
type UseCreateCustomerOptions = UseMutationOptions<unknown, Error, TCreateCustomerPayload>;
type UseCreateLoanOptions = UseMutationOptions<unknown, Error, TCreateLoanPayload>;
type UseDownloadReportOptions = UseMutationOptions<unknown, Error, TDownloadReportPayload>;

const useDashboard = () => {
    const useNotes = (options?: UseNotesOptions) =>
        useMutation({
            mutationKey: [NOTES],
            mutationFn: (payload: TNotesPayload) => dashboardService.notes(payload),
            ...options,
        });

    const useGetNotes = () => useQuery({
        queryKey: [GET_NOTES],
        queryFn: () => dashboardService.getNotes(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const useCreateCustomer = (options?: UseCreateCustomerOptions) =>
        useMutation({
            mutationKey: [CREATE_CUSTOMER],
            mutationFn: (payload: TCreateCustomerPayload) => dashboardService.createCustomer(payload),
            ...options,
        });

    const useGetCustomers = (searchParams: string | null) => useQuery({
        queryKey: [GET_CUSTOMER, searchParams],
        queryFn: () => dashboardService.getCustomers(searchParams),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const useGetTransactionsSummary = () => useQuery({
        queryKey: [GET_TRANSACTION_SUMMARY],
        queryFn: () => dashboardService.getTransactionsSummary(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const useGetCustomerById = (id: string) => useQuery({
        queryKey: [GET_CUSTOMER_BY_ID, id],
        queryFn: () => dashboardService.getCustomerById(id),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const useCreateLoan = (options?: UseCreateLoanOptions) =>
        useMutation({
            mutationKey: [CREATE_LOAN],
            mutationFn: (payload: TCreateLoanPayload) => dashboardService.createLoan(payload),
            ...options,
        });

    const useCreateTransactions = (options?: UseCreateLoanOptions) =>
        useMutation({
            mutationKey: [CREATE_TRANSACTIONS],
            mutationFn: (payload: TCreateLoanPayload) => dashboardService.createTransaction(payload),
            ...options,
        });

    const useGetTransactions = (params: string) => useQuery({
        queryKey: [GET_TRANSACTIONS, params],
        queryFn: () => dashboardService.getTransactions(params),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const useDownloadReport = (options?: UseDownloadReportOptions) =>
        useMutation({
            mutationKey: [DOWNLOAD_REPORT],
            mutationFn: (payload: TDownloadReportPayload) => dashboardService.downloadReport(payload),
            ...options,
        });

    const useDownloadDelete = () =>
        useMutation({
            mutationKey: [DOWNLOAD_REPORT],
            mutationFn: () => dashboardService.deleteReport(),
        });

    return {
        useNotes,
        useGetNotes,
        useCreateCustomer,
        useGetCustomers,
        useCreateLoan,
        useCreateTransactions,
        useGetTransactions,
        useGetCustomerById,
        useGetTransactionsSummary,
        useDownloadReport,
        useDownloadDelete
    };
};

export default useDashboard;