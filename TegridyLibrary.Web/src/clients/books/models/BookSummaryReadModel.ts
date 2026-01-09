
export default interface BookSummaryReadModel {
    id: string;
    title: string;
    isbn: string | null;
    twoLetterIsoLanguageName: string;
    genre: string;
    author: string;
    publisher: string;
    copiesCount: string;
}