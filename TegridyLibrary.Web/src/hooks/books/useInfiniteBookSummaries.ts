import {useInfiniteQuery} from "@tanstack/react-query";
import booksClient from "@/clients/books/booksClient.ts";

export function queryKey(searchPhrase: string) {
    return ['book-summaries', searchPhrase];
}

const defaultQueries = {
    pageNumber: 1,
    pageSize: 50,
    searchPhrase: "",
}

export default function useInfiniteBookSummaries(searchPhrase: string) {
    return useInfiniteQuery({
        queryKey: queryKey(searchPhrase),
        queryFn: async ({pageParam = 1}) => {
            const response = await booksClient.getPaginatedBooks({
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