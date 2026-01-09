import {Label} from "@/components/ui/label.tsx";
import type {FormEvent} from "react";
import ReaderAutocomplete from "@/components/readers/ReaderAutocomplete.tsx";
import BookForBookLoanAutocomplete from "@/components/book-loans/BookForBookLoanAutocomplete.tsx";

export interface BookLoanFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: BookLoanFormData) => Promise<void>;
    message?: string;
}

export interface BookLoanFormData {
    readerId: string;
    bookCopyId: string;
}

export default function BookLoanForm({ formId, onSubmit, disabled, message}: BookLoanFormProps) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const readerId = rawFormData.get('readerId') as string;
        const bookCopyId = rawFormData.get('bookCopyId') as string;

        const bookLoanFormData = {
            readerId,
            bookCopyId
        }

        await onSubmit(bookLoanFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Reader*</Label>
                        <ReaderAutocomplete id="readerId" name="readerId" />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="bookCopyId">Book copy*</Label>
                        <BookForBookLoanAutocomplete id="bookCopyId" name="bookCopyId" />
                    </div>
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}