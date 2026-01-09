import {useQuery} from "@tanstack/react-query";
import readersClient from "@/clients/readers/readersClient.ts";

export default function useReaders() {
    return useQuery({
        queryKey: ['readers'],
        queryFn: () => readersClient.getReaders().then(x => x.data),
    });
}