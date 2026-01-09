import type GenreReadModel from "@/clients/genres/models/GenreReadModel.ts";
import type PublisherReadModel from "@/clients/publishers/models/PublisherReadModel.ts";
import type AuthorReadModel from "@/clients/authors/models/AuthorReadModel.ts";

export default interface BookDetailsReadModel {
    id: string;
    title: string;
    originalTitle: string | null;
    description: string | null;
    twoLetterIsoLanguageName: string;
    genre: GenreReadModel | null;
    author: AuthorReadModel | null;
    publisher: PublisherReadModel | null;
    isbn: string | null;
    publicationDate: string;
    copies: BookCopyModel[];
}

interface BookCopyModel {
    id: string;
    inventoryNumber: string;
    acquiredDate: string;
    estimatedPrice: number;
}