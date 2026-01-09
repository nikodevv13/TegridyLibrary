import AppSpinner from "@/components/AppSpinner.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import {useMemo, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Plus} from "lucide-react";
import {Link} from "react-router-dom";
import useInfiniteBookSummaries from "@/hooks/books/useInfiniteBookSummaries.ts";
import InfiniteList from "@/components/InfinityList.tsx";
import type BookSummaryReadModel from "@/clients/books/models/BookSummaryReadModel.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DeleteBookDialog} from "@/components/books/DeleteBookDialog.tsx";
import { debounce } from "lodash";

export default function BooksPage() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const {data, isPending, fetchNextPage} = useInfiniteBookSummaries(searchPhrase);

    const debouncedSetSearchPhrase = useMemo(() => debounce((searchPhrase) => setSearchPhrase(searchPhrase), 600), []);

    const books = data?.pages.flatMap(x => x.items) || [];

    const items = books.map(x => (<BooksInfinityListItem key={x.id} book={x}/>));

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <SearchBar onChange={debouncedSetSearchPhrase}/>
                <Button variant="outline" asChild>
                    <Link to={'/library/books/create'}>
                        <Plus/> Create a book
                    </Link>
                </Button>
            </div>
            {isPending ? (
                <AppSpinner/>
            ) : (
                <div className="flex flex-col gap-3">
                    <InfiniteList items={items} fetchNextItems={fetchNextPage}/>
                </div>
            )}
        </div>
    )
}

interface BooksInfinityListItemProps {
    book: BookSummaryReadModel;
}

function BooksInfinityListItem({book}: BooksInfinityListItemProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="line-clamp-2 text-lg flex align-center gap-3">
                    <span className="me-auto">
                        {book.title} ({book.twoLetterIsoLanguageName.toUpperCase()})
                    </span>

                    <Button asChild size="sm">
                        <Link to={`/library/books/${book.id}`}>
                            <Pencil/> Update
                        </Link>
                    </Button>
                    <DeleteBookDialog book={book}/>
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">
                    ISBN: {book.isbn || "-"}
                </p>
            </CardHeader>

            <CardContent className="flex-1">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <dt className="text-muted-foreground">Genre</dt>
                        <dd className="font-medium">{book.genre}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Author</dt>
                        <dd className="font-medium">{book.author}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Publisher</dt>
                        <dd className="font-medium">{book.publisher}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Copies</dt>
                        <dd className="font-medium">{book.copiesCount}</dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    )
}