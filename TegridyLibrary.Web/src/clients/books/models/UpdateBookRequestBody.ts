
export default interface UpdateBookRequestBody {
    title: string;
    originalTitle: string | null;
    description: string | null;
    isbn: string | null;
    twoLetterIsoLanguageName: string;
    publicationDate: string | null;
    genreId: string | null;
    authorId: string | null;
    publisherId: string | null;
    copies: BookCopyModel[]
}

export interface BookCopyModel {
    inventoryNumber: string;
    acquiredDate: string;
    estimatedPrice: number;
}