
export default interface BookForBookLoanReadModel {
    bookId: string;
    title: string;
    isbn: string | null;
    copies: BookCopyModel[];
}

export interface BookCopyModel {
    bookCopyId: string
    inventoryNumber: string
}