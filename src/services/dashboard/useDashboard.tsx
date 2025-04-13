import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { GET_NOTES, NOTES } from "@/utils";
import { TNotesPayload } from "./types";
import dashboardService from "./dashboard";

type UseNotesOptions = UseMutationOptions<unknown, Error, TNotesPayload>;

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

    return {
        useNotes,
        useGetNotes,
    };
};

export default useDashboard;