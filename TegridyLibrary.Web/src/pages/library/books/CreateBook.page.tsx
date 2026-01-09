import {Button} from "@/components/ui/button.tsx";
import {Save} from "lucide-react";
import BookForm, { type BookFormData } from "@/components/books/BookForm.tsx";
import {useMutation} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import booksClient from "@/clients/books/booksClient.ts";
import type CreateBookRequestBody from "@/clients/books/models/CreateBookRequestBody.ts";
import {useNavigate} from "react-router-dom";

export default function CreateBookPage() {
    const navigate = useNavigate();

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateBookRequestBody) => booksClient.createBook(requestBody).then(x => x.data),
        onSuccess: async (data) => {
            await navigate(`/library/books/${data.id}`)
        }
    });

    async function handleSubmit(formData: BookFormData) {
        await mutateAsync(formData)
    }

    let message: string | undefined;

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <div className="flex flex-col gap-3">

            <div className="grid grid-cols-[1fr_auto] gap-3">
                <h2 className="font-semibold text-xl">
                    Create a book
                </h2>
                <Button form={"book-form-create"} >
                    <Save/> Create
                </Button>
            </div>
            <p className="text-destructive">
                {message}
            </p>
            <BookForm formId={"book-form-create"} disabled={isPending} onSubmit={handleSubmit} />
        </div>
    )
}