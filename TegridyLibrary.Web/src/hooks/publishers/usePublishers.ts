import {useQuery} from "@tanstack/react-query";
import publishersClient from "@/clients/publishers/publishersClients.ts";

export default function usePublishers() {
    return useQuery({
        queryKey: ['publishers'],
        queryFn: () => publishersClient.getPublishers().then(x => x.data),
    });
}