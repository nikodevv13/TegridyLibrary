import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";

export interface ReaderFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: ReaderFormData) => Promise<void>;
    message?: string;
    defaultValues?: ReaderFormData
}

export interface ReaderFormData {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ReaderForm({ formId, defaultValues, onSubmit, disabled, message}: ReaderFormProps) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const firstName = rawFormData.get('firstName') as string;
        const lastName = rawFormData.get('lastName') as string;
        const email = rawFormData.get('email') as string;

        const readerFormData = {
            firstName,
            lastName,
            email
        }

        await onSubmit(readerFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="firstName">Name</Label>
                        <Input type="firstName" id="firstName" name="firstName" required
                               placeholder="John" defaultValue={defaultValues?.firstName} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="firstName">Name</Label>
                        <Input type="lastName" id="lastName" name="lastName" required
                               placeholder="Doe" defaultValue={defaultValues?.lastName} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="email">Name</Label>
                        <Input type="email" id="email" name="email" required
                               placeholder="john@doe.com" defaultValue={defaultValues?.email} />
                    </div>
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}