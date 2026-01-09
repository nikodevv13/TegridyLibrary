import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";

export interface PublisherFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: PublisherFormData) => Promise<void>;
    message?: string;
    defaultValues?: PublisherFormData
}

export interface PublisherFormData {
    name: string;
}

export default function PublisherForm({ formId, defaultValues, onSubmit, disabled, message}: PublisherFormProps) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const name = rawFormData.get('name') as string;

        const publisherFormData = {
            name
        }

        await onSubmit(publisherFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input type="name" id="name" name="name" required
                               placeholder="O'Reilly Media" defaultValue={defaultValues?.name} />
                    </div>
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}