import {useQuery} from "@tanstack/react-query";
import librariansClient from "@/clients/librarians/librariansClient.ts";

export default function useLibrarians() {
    return useQuery({
        queryKey: ['librarians'],
        queryFn: () => librariansClient.getLibrarians(),
    });
}