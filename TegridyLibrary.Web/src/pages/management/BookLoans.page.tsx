import AppSpinner from "@/components/AppSpinner.tsx";
import SearchBar from "@/components/SearchBar.tsx";
import {useMemo, useState} from "react";
import InfiniteList from "@/components/InfinityList.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {debounce} from "lodash";
import useInfiniteBookLoans from "@/hooks/book-loans/useInfiniteBookLoans.ts";
import type BookLoanReadModel from "@/clients/book-loans/models/BookLoanReadModel.ts";
import {CompleteBookLoanDialog} from "@/components/book-loans/CompleteBookLoanDialog.tsx";
import {CreateBookLoanDialog} from "@/components/book-loans/CreateBookLoanDialog.tsx";

export default function BookLoansPage() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const {data, isPending, fetchNextPage} = useInfiniteBookLoans(searchPhrase);

    const debouncedSetSearchPhrase = useMemo(() => debounce((searchPhrase) => setSearchPhrase(searchPhrase), 600), []);

    const bookLoans = data?.pages.flatMap(x => x.items) || [];

    const items = bookLoans.map(x => (<BookLoansInfinityListItem key={x.id} bookLoan={x}/>));

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
                <SearchBar onChange={debouncedSetSearchPhrase}/>
                <CreateBookLoanDialog/>
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

interface BookLoansInfinityListItemProps {
    bookLoan: BookLoanReadModel;
}

function BookLoansInfinityListItem({bookLoan}: BookLoansInfinityListItemProps) {
    const {book} = bookLoan;

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="line-clamp-2 text-lg flex items-center gap-3">
                    <span className="me-auto">
                        {book.title}
                    </span>
                    {!bookLoan.completedAt ? (
                        <CompleteBookLoanDialog bookLoan={bookLoan}/>

                    ) : null}
                </CardTitle>

                <p className="text-sm text-muted-foreground line-clamp-1">
                    ISBN: {book.isbn ?? "-"} | Inventory: {book.inventoryNumber}
                </p>
            </CardHeader>

            <CardContent className="flex-1">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <dt className="text-muted-foreground">Reader</dt>
                        <dd className="font-medium">
                            {bookLoan.reader.firstName} {bookLoan.reader.lastName} [{bookLoan.reader.email}]
                        </dd>
                    </div>

                    <div>
                        <dt className="text-muted-foreground">Started by</dt>
                        <dd className="font-medium">
                            {bookLoan.startedByLibrarian.firstName} {bookLoan.startedByLibrarian.lastName} [{bookLoan.startedByLibrarian.email}]
                        </dd>
                    </div>

                    <div>
                        <dt className="text-muted-foreground">Started at / Completed at</dt>
                        <dd className="font-medium">
                            {new Date(bookLoan.startedAt).toLocaleDateString()} / {bookLoan.completedAt
                            ? new Date(bookLoan.completedAt).toLocaleDateString()
                            : "-"}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-muted-foreground">Completed by</dt>
                        <dd className="font-medium">
                            {bookLoan.completedByLibrarian ? (
                                <>
                                    {bookLoan.completedByLibrarian?.firstName} {bookLoan.completedByLibrarian?.lastName} [{bookLoan.completedByLibrarian?.email}]
                                </>
                            ) : '-'}
                        </dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
}
