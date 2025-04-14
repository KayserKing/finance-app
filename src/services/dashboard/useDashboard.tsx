import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { CREATE_CUSTOMER, CREATE_LOAN, CREATE_TRANSACTIONS, GET_CUSTOMER, GET_NOTES, NOTES } from "@/utils";
import { TCreateCustomerPayload, TCreateLoanPayload, TNotesPayload } from "./types";
import dashboardService from "./dashboard";

type UseNotesOptions = UseMutationOptions<unknown, Error, TNotesPayload>;
type UseCreateCustomerOptions = UseMutationOptions<unknown, Error, TCreateCustomerPayload>;
type UseCreateLoanOptions = UseMutationOptions<unknown, Error, TCreateLoanPayload>;

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

    const useGetCustomers = () => useQuery({
        queryKey: [GET_CUSTOMER],
        queryFn: () => dashboardService.getCustomers(),
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

    return {
        useNotes,
        useGetNotes,
        useCreateCustomer,
        useGetCustomers,
        useCreateLoan,
        useCreateTransactions
    };
};

export default useDashboard;