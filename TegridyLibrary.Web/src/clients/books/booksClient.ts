import {axiosClient} from "@/clients/shared/axiosClient.ts";
import type CreateBookRequestBody from "@/clients/books/models/CreateBookRequestBody.ts";
import type BookDetailsReadModel from "@/clients/books/models/BookDetailsReadModel.ts";
import type GetPaginatedBookSummariesQueries from "@/clients/books/models/GetPaginatedBookSummariesQueries.ts";
import type {Paginated} from "@/clients/shared/models/Paginated.ts";
import type BookSummaryReadModel from "@/clients/books/models/BookSummaryReadModel.ts";
import type UpdateBookRequestBody from "@/clients/books/models/UpdateBookRequestBody.ts";

async function createBook(request: CreateBookRequestBody) {
    return axiosClient.post<BookDetailsReadModel>(`/api/books/create`, request);
}
async function updateBook(bookId: string, request: UpdateBookRequestBody) {
    return axiosClient.put<BookDetailsReadModel>(`/api/books/${bookId}`, request);
}
async function getBookDetails(bookId: string) {
    return axiosClient.get<BookDetailsReadModel>(`/api/books/${bookId}`);
}
async function getPaginatedBooks(queries: GetPaginatedBookSummariesQueries) {
    return axiosClient.get<Paginated<BookSummaryReadModel>>(`/api/books`, { params: queries });
}

async function deleteBook(bookId: string) {
    return axiosClient.delete(`/api/books/${bookId}`);
}

const booksClient = {
    createBook,
    updateBook,
    getBookDetails,
    getPaginatedBooks,
    deleteBook
}

export default booksClient;