import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";
import type {BookCopyFormData} from "@/components/books/BookForm.tsx";
import {DatePicker} from "@/components/DatePicker.tsx";

export interface BookCopyFormProps {
    formId: string;
    onSubmit: (data: BookCopyFormData) => Promise<void>;
    message?: string;
    defaultValues?: BookCopyFormData
}

export default function BookCopyForm({ formId, defaultValues, onSubmit, message}: BookCopyFormProps) {
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        const rawFormData = new FormData(e.currentTarget);
        const inventoryNumber = rawFormData.get('inventoryNumber') as string;
        const acquiredDate = rawFormData.get('acquiredDate') as string;
        const estimatedPrice = rawFormData.get('estimatedPrice') as string;

        const bookCopyFormData = {
            id: defaultValues?.id || null,
            inventoryNumber,
            acquiredDate,
            estimatedPrice: +estimatedPrice,
        }

        await onSubmit(bookCopyFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="inventoryNumber">Inventory Number</Label>
                    <Input type="text" id="inventoryNumber" name="inventoryNumber" required
                           placeholder="XYZ-ABCD" defaultValue={defaultValues?.inventoryNumber} />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="acquiredDate">Acquired Date</Label>
                    <DatePicker id="acquiredDate" name="acquiredDate" defaultValue={defaultValues?.acquiredDate} />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="estimatedPrice">Estimated Price (PLN)</Label>
                    <Input type="number" id="estimatedPrice" name="estimatedPrice" required
                           placeholder="10.99" step=".01" defaultValue={defaultValues?.estimatedPrice} />
                </div>
            </div>

            <p className={"text-left text-destructive"}>
                {message}
            </p>
        </form>
    )
}