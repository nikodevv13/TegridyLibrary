import {useInfiniteQuery} from "@tanstack/react-query";
import bookLoansClient from "@/clients/book-loans/bookLoansClient.ts";


export function queryKey(searchPhrase: string) {
    return ['book-loans', searchPhrase];
}

const defaultQueries = {
    pageNumber: 1,
    pageSize: 50,
    searchPhrase: "",
}

export default function useInfiniteBookLoans(searchPhrase: string) {
    return useInfiniteQuery({
        queryKey: queryKey(searchPhrase),
        queryFn: async ({pageParam = 1}) => {
            const response = await bookLoansClient.getPaginatedBookLoans({
                ...defaultQueries,
                pageNumber: pageParam,
                searchPhrase
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
        initialPageParam: 1,
        staleTime: 0,
        gcTime: 0,
    });
}