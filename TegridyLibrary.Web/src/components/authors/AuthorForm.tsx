import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";

export interface AuthorFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: AuthorFormData) => Promise<void>;
    message?: string;
    defaultValues?: AuthorFormData
}

export interface AuthorFormData {
    firstName: string;
    lastName: string;
}

export default function AuthorForm({ formId, defaultValues, onSubmit, disabled, message}: AuthorFormProps) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const firstName = rawFormData.get('firstName') as string;
        const lastName = rawFormData.get('lastName') as string;

        const authorFormData = {
            firstName,
            lastName,
        }

        await onSubmit(authorFormData);
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
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}