import type ReaderReadModel from "@/clients/readers/models/ReaderReadModel.ts";
import type LibrarianSummaryReadModel from "@/clients/librarians/models/LibrarianSummaryReadModel.ts";

export default interface BookLoanReadModel {
    id: string;

    book: BookLoanBookCopyModel;
    reader: ReaderReadModel;
    startedByLibrarian: LibrarianSummaryReadModel;
    completedByLibrarian: LibrarianSummaryReadModel | null;

    startedAt: string;
    completedAt: string | null;
}

export interface BookLoanBookCopyModel {
    bookId: string;
    bookCopyId: string;
    title: string;
    isbn: string | null;
    inventoryNumber: string;
}