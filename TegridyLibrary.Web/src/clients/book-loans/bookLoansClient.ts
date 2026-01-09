import {axiosClient} from "@/clients/shared/axiosClient.ts";
import type BookDetailsReadModel from "@/clients/books/models/BookDetailsReadModel.ts";
import type CreateBookLoanRequestBody from "@/clients/book-loans/models/CreateBookLoanRequestBody.ts";
import type BookLoanReadModel from "./models/BookLoanReadModel";
import type GetPaginatedBooksForBookLoanCreationRequestQueries
    from "@/clients/book-loans/models/GetPaginatedBooksForBookLoanCreationRequestQueries.ts";
import type GetPaginatedBookLoansRequestQueries
    from "@/clients/book-loans/models/GetPaginatedBookLoansRequestQueries.ts";
import type {Paginated} from "@/clients/shared/models/Paginated.ts";
import type BookForBookLoanReadModel from "@/clients/book-loans/models/BookForBookLoanReadModel.ts";

async function createBookLoan(body: CreateBookLoanRequestBody) {
    return axiosClient.post<BookLoanReadModel>(`/api/book-loans/create`, body);
}
async function completeBookLoan(bookLoanId: string) {
    return axiosClient.post<BookDetailsReadModel>(`/api/book-loans/${bookLoanId}/complete`);
}

async function getPaginatedBookLoans(queries: GetPaginatedBookLoansRequestQueries) {
    return axiosClient.get<Paginated<BookLoanReadModel>>(`/api/book-loans`, { params: queries});
}

async function getPaginatedBooksForBookLoanCreation(queries: GetPaginatedBooksForBookLoanCreationRequestQueries) {
    return axiosClient.get<Paginated<BookForBookLoanReadModel>>(`/api/book-loans/available-books`, { params: queries });
}

const bookLoansClient = {
    createBookLoan,
    completeBookLoan,
    getPaginatedBookLoans,
    getPaginatedBooksForBookLoanCreation
}

export default bookLoansClient;