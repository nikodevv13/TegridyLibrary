import {Button} from "@/components/ui/button.tsx";
import {AlertCircleIcon, Save} from "lucide-react";
import BookForm, {type BookFormData} from "@/components/books/BookForm.tsx";
import {isAxiosError} from "axios";
import {useParams} from "react-router-dom";
import useBookDetails from "@/hooks/books/useBookDetails.tsx";
import {useMutation} from "@tanstack/react-query";
import booksClient from "@/clients/books/booksClient.ts";
import AppSpinner from "@/components/AppSpinner.tsx";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {useMemo} from "react";
import type UpdateBookRequestBody from "@/clients/books/models/UpdateBookRequestBody.ts";

export default function CreateBookPage() {
    const bookId = useParams().id || '';

    const {data, isPending: isPendingBookDetails, refetch} = useBookDetails(bookId);

    const bookDetails = data;

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdateBookRequestBody) => booksClient.updateBook(bookId, requestBody).then(x => x.data),
        onSuccess: async () => {
            await refetch()
        }
    });

    const defaultValues = useMemo((): BookFormData | undefined => {
        if (bookDetails) {
            return {
                title: bookDetails.title,
                originalTitle: bookDetails.originalTitle,
                description: bookDetails.description,
                isbn: bookDetails.isbn,
                twoLetterIsoLanguageName: bookDetails.twoLetterIsoLanguageName,
                publicationDate: bookDetails.publicationDate,
                genreId: bookDetails.genre?.id || null,
                authorId: bookDetails.author?.id || null,
                publisherId: bookDetails.publisher?.id || null,
                copies: bookDetails.copies
            }
        } else {
            return undefined
        }
    }, [bookDetails])

    async function handleSubmit(formData: BookFormData) {
        await mutateAsync(formData)
    }

    if (isPendingBookDetails) {
        return (
            <AppSpinner/>
        )
    }

    if (!bookDetails) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Unable to get book with ID `{bookId}`.</AlertTitle>
            </Alert>
        )
    }

    let message: string | undefined;

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <div className="flex flex-col gap-3">

            <div className="grid grid-cols-[1fr_auto] gap-3">
                <h2 className="font-semibold text-xl">
                    Update book
                </h2>
                <Button form={"book-form-create"}>
                    <Save/> Update
                </Button>
            </div>
            <p className="text-destructive">
                {message}
            </p>
            <BookForm defaultValues={defaultValues} formId={"book-form-create"} disabled={isPending} onSubmit={handleSubmit}/>
        </div>
    )
}