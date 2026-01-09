import {useQuery} from "@tanstack/react-query";
import genresClient from "@/clients/genres/genresClient.ts";

export default function useGenres() {
    return useQuery({
        queryKey: ['genres'],
        queryFn: () => genresClient.getGenres().then(x => x.data),
    });
}