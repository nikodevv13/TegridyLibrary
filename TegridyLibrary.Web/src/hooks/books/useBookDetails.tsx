import {useQuery} from "@tanstack/react-query";
import booksClient from "@/clients/books/booksClient.ts";

export function queryKey(bookId: string) {
    return ['books', bookId];
}

export default function useBookDetails(bookId: string) {
    return useQuery({
        queryKey: queryKey(bookId),
        queryFn: () => booksClient.getBookDetails(bookId).then(x => x.data),
        enabled: !!bookId,
    })
}