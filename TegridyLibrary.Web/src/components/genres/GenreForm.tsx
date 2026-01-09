import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";

export interface GenreFormProps {
    formId: string;
    disabled: boolean;
    onSubmit: (data: GenreFormData) => Promise<void>;
    message?: string;
    defaultValues?: GenreFormData
}

export interface GenreFormData {
    name: string;
}

export default function GenreForm({ formId, defaultValues, onSubmit, disabled, message}: GenreFormProps) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const name = rawFormData.get('name') as string;

        const genreFormData = {
            name
        }

        await onSubmit(genreFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input type="name" id="name" name="name" required
                               placeholder="Romance" defaultValue={defaultValues?.name} />
                    </div>
                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}