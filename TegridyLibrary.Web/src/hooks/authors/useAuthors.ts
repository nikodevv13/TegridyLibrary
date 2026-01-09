import {useQuery} from "@tanstack/react-query";
import authorsClient from "@/clients/authors/authorsClient.ts";

export default function useGenres() {
    return useQuery({
        queryKey: ['authors'],
        queryFn: () => authorsClient.getAuthors().then(x => x.data),
    });
}