import {useQuery} from "@tanstack/react-query";
import analyticsClient from "@/clients/analytics/analyticsClient.ts";

export default function useGlobalAnalytics(){
    return useQuery({
        queryKey: ['analytics-global'],
        queryFn: () => analyticsClient.getGlobalAnalytics().then(x => x.data),
    });
}