
export interface Paginated<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}