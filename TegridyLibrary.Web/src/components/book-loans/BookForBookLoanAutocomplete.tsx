import {useCallback, useState} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { cn } from "@/components/ui/lib/utils";
import type BookForBookLoanReadModel from "@/clients/book-loans/models/BookForBookLoanReadModel.ts";
import useSearchBookForBookLoan from "@/hooks/book-loans/useSearchBookForBookLoan.ts";
import {debounce} from "lodash";

export interface BookCopyAutocompleteProps {
    id: string;
    name: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function BookForBookLoanAutocomplete({
                                                 id,
                                                 name,
                                                 defaultValue,
                                                 disabled
                                             }: BookCopyAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue ?? "");
    const [searchPhrase, setSearchPhrase] = useState("");

    const debouncedSearchPhrase = useCallback(() => debounce(setSearchPhrase, 500), [])

    const { data } = useSearchBookForBookLoan(searchPhrase);
    const books: BookForBookLoanReadModel[] = data?.items ?? [];

    const allCopies = books.flatMap(book =>
        book.copies.map(copy => ({
            ...copy,
            bookTitle: book.title
        }))
    );

    const currentCopy = allCopies.find(c => c.bookCopyId === value) ?? null;

    const truncateTitle = (title: string) =>
        title.length > 200 ? `${title.slice(0, 200)}…` : title;

    return (
        <>
            <input type="hidden" name={name} value={value} />

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        disabled={disabled}
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                    >
                        {currentCopy
                            ? currentCopy.inventoryNumber
                            : "Select book copy..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[400px]">
                    <Command>
                        <CommandInput
                            placeholder="Search..."
                            value={searchPhrase}
                            onValueChange={debouncedSearchPhrase}
                        />
                        <CommandList>
                            <CommandEmpty>No available copy found.</CommandEmpty>

                            {books.map(book => (
                                <CommandGroup
                                    key={book.bookId}
                                    heading={truncateTitle(book.title)}
                                >
                                    {book.copies.map(copy => (
                                        <CommandItem
                                            key={copy.bookCopyId}
                                            value={copy.bookCopyId}
                                            onSelect={() => {
                                                setValue(copy.bookCopyId);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {copy.inventoryNumber} - {book.title}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === copy.bookCopyId
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
