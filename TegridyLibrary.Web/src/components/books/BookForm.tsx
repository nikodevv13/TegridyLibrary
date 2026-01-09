import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {type FormEvent, useState} from "react";
import GenreAutocomplete from "@/components/genres/GenreAutocomplete.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import AuthorAutocomplete from "@/components/authors/AuthorAutocomplete.tsx";
import PublisherAutocomplete from "@/components/publishers/PublisherAutocomplete.tsx";
import LanguageSelect from "@/components/LanguageSelect.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {CreateBookCopyDialog} from "@/components/books/CreateBookCopyDialog.tsx";
import {DeleteBookCopyDialog} from "@/components/books/DeleteBookCopyDialog.tsx";
import {UpdateBookCopyDialog} from "@/components/books/UpdateBookCopyDialog.tsx";
import {DatePicker} from "@/components/DatePicker.tsx";

export interface BookFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: BookFormData) => Promise<void>;
    message?: string;
    defaultValues?: BookFormData
}

export interface BookFormData {
    title: string;
    originalTitle: string | null;
    description: string | null;
    isbn: string | null;
    twoLetterIsoLanguageName: string;
    publicationDate: string | null;
    genreId: string | null;
    authorId: string | null;
    publisherId: string | null;
    copies: BookCopyFormData[]
}

export interface BookCopyFormData {
    id: string | null;
    inventoryNumber: string;
    acquiredDate: string;
    estimatedPrice: number;
}

export default function BookForm({ formId, defaultValues, onSubmit, disabled, message}: BookFormProps) {
    const [bookCopies, setBookCopies] = useState<(BookCopyFormData & { key: string })[]>(() => (defaultValues?.copies.map(x => ({...x, key: crypto.randomUUID()})) || []));

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const title = rawFormData.get('title') as string;
        const originalTitle = rawFormData.get('originalTitle') as string | null || null;
        const isbn = rawFormData.get('isbn') as string | null || null;
        const description = rawFormData.get('description') as string | null || null;
        const twoLetterIsoLanguageName = rawFormData.get('twoLetterIsoLanguageName') as string;
        const publicationDate = rawFormData.get('publicationDate') as string;
        const genreId = rawFormData.get('genreId') as string || null;
        const authorId = rawFormData.get('authorId') as string || null;
        const publisherId = rawFormData.get('publisherId') as string || null;

        const bookFormData = {
            title,
            isbn,
            originalTitle,
            description,
            twoLetterIsoLanguageName,
            publicationDate,
            genreId,
            authorId,
            publisherId,
            copies: bookCopies
        }

         await onSubmit(bookFormData);
    }

    async function onCreateBookCopy(bookCopy: BookCopyFormData) {
        if (bookCopies.find(x => x.inventoryNumber === bookCopy.inventoryNumber)) {
            return `Copy with inventory number \`${bookCopy.inventoryNumber}\` already exists`;
        }

        setBookCopies(x => ([...x, { ...bookCopy, key: crypto.randomUUID() }]))

        return null
    }

    async function onUpdateBookCopy(key: string, bookCopy: BookCopyFormData) {
        if (bookCopies.find(x => x.inventoryNumber === bookCopy.inventoryNumber && x.key !== key)) {
            return `Copy with inventory number \`${bookCopy.inventoryNumber}\` already exists`;
        }

        setBookCopies(x => x.map(x => {
            if (x.key === key) return { ...bookCopy, key };
            return x;
        }))

        return null
    }


    async function onDeleteBookCopy(key: string) {
        setBookCopies(x => x.filter(x => x.key !== key));
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title*</Label>
                            <Input type="title" id="title" name="title" required
                                   placeholder="Title" defaultValue={defaultValues?.title} maxLength={50} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="originalTitle">Original Title</Label>
                            <Input type="originalTitle" id="originalTitle" name="originalTitle"
                                   placeholder="Original Title" defaultValue={defaultValues?.originalTitle || undefined} maxLength={50} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input type="description" id="description" name="description"
                                   placeholder="Description" defaultValue={defaultValues?.description || undefined} maxLength={1000} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input type="isbn" id="isbn" name="isbn"
                                   placeholder="ISBN" defaultValue={defaultValues?.isbn || undefined} maxLength={13} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="twoLetterIsoLanguageName">Language* (Country)</Label>
                            <LanguageSelect required id="twoLetterIsoLanguageName" name="twoLetterIsoLanguageName" defaultValue={defaultValues?.twoLetterIsoLanguageName || undefined}/>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="publicationDate">Publication Date</Label>
                            <DatePicker disabled={disabled} id="publicationDate" name="publicationDate" defaultValue={defaultValues?.publicationDate || undefined} />
                        </div>

                        <Separator />

                        <div className="grid gap-3">
                            <Label htmlFor="genreId">Genre</Label>
                            <GenreAutocomplete disabled={disabled} id="genreId" name="genreId" defaultValue={defaultValues?.genreId || undefined} />
                        </div>

                        <Separator />

                        <div className="grid gap-3">
                            <Label htmlFor="authorId">Author</Label>
                            <AuthorAutocomplete disabled={disabled} id="authorId" name="authorId" defaultValue={defaultValues?.authorId || undefined} />
                        </div>

                        <Separator />

                        <div className="grid gap-3">
                            <Label htmlFor="publisherId">Publisher</Label>
                            <PublisherAutocomplete disabled={disabled} id="publisherId" name="publisherId" defaultValue={defaultValues?.publisherId || undefined} />
                        </div>

                        <Separator />


                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Manage copies</h3>
                            <CreateBookCopyDialog onCreate={onCreateBookCopy} />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Inventory Number</TableHead>
                                    <TableHead>Aquired Date</TableHead>
                                    <TableHead>Estimated Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookCopies.map((bookCopy) => (
                                    <TableRow key={bookCopy.key}>
                                        <TableCell>{bookCopy.inventoryNumber}</TableCell>
                                        <TableCell>{new Date(bookCopy.acquiredDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{+(bookCopy.estimatedPrice).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <DeleteBookCopyDialog bookCopy={bookCopy} onDelete={onDeleteBookCopy} />
                                                <UpdateBookCopyDialog bookCopy={bookCopy} onUpdate={onUpdateBookCopy} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}