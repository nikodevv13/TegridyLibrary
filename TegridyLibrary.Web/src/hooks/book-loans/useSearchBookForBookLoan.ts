import {useQuery} from "@tanstack/react-query";
import bookLoansClient from "@/clients/book-loans/bookLoansClient.ts";

export function queryKey(searchPhrase: string) {
    return ['book-summaries', searchPhrase];
}

const defaultQueries = {
    pageNumber: 1,
    pageSize: 50,
    searchPhrase: "",
}

export default function useSearchBookForBookLoan(searchPhrase: string) {
    return useQuery({
        queryKey: queryKey(searchPhrase),
        queryFn: async () => {
            const response = await bookLoansClient.getPaginatedBooksForBookLoanCreation({ ...defaultQueries, searchPhrase });
            return response.data;
        },
    });
}