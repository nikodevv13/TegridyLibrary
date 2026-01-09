import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {FormEvent} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import LibrarianPermissions from "@/clients/librarians/models/LibrarianPermissions.ts";

export interface LibrarianForm {
    formId: string;
    disabled: boolean;
    onSubmit: (data: LibrarianFormData) => Promise<void>;
    message?: string;
    defaultValues?: LibrarianFormData
}

export interface LibrarianFormData {
    firstName: string;
    lastName: string;
    email: string;
    permissions: number[];
}

export default function LibrarianForm({ formId, defaultValues, onSubmit, disabled, message}: LibrarianForm) {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const firstName = rawFormData.get('firstName') as string;
        const lastName = rawFormData.get('lastName') as string;
        const email = rawFormData.get('email') as string;

        const permissions: number[] = [];

        if (rawFormData.get('manageLibrarians')) permissions.push(LibrarianPermissions.ManageLibrarians)
        if (rawFormData.get('manageReaders')) permissions.push(LibrarianPermissions.ManageReaders)
        if (rawFormData.get('manageBooks')) permissions.push(LibrarianPermissions.ManageBooks)
        if (rawFormData.get('manageBookLoans')) permissions.push(LibrarianPermissions.ManageBookLoans)

        const librarianFormData = {
            firstName,
            lastName,
            email,
            permissions,
        }

        await onSubmit(librarianFormData);
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="contents">
            <fieldset disabled={disabled} className="contents">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="firstName">First name</Label>
                        <Input type="text" id="firstName" name="firstName" required
                               placeholder="John" defaultValue={defaultValues?.firstName} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input required type="text" id="lastName" name="lastName" placeholder="Doe" defaultValue={defaultValues?.lastName} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input required type="email" id="email" name="email" placeholder="john@doe.com" defaultValue={defaultValues?.email}/>
                    </div>

                    <p>Permissions:</p>

                    <div className="flex flex-col space-y-2 pl-4">
                        <div className="flex items-center gap-3">
                            <Checkbox id="manageLibrarians" name="manageLibrarians" defaultChecked={defaultValues?.permissions?.includes(LibrarianPermissions.ManageLibrarians)} />
                            <Label htmlFor="manageLibrarians">Manage Librarians</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="manageReaders" name="manageReaders" defaultChecked={defaultValues?.permissions?.includes(LibrarianPermissions.ManageReaders)} />
                            <Label htmlFor="manageReaders">Manage Readers</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="manageBooks" name="manageBooks" defaultChecked={defaultValues?.permissions?.includes(LibrarianPermissions.ManageBooks)} />
                            <Label htmlFor="manageBooks">Manage Books</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="manageBookLoans" name="manageBookLoans" defaultChecked={defaultValues?.permissions?.includes(LibrarianPermissions.ManageBookLoans)} />
                            <Label htmlFor="manageBookLoans">Manage Books Loans</Label>
                        </div>
                    </div>

                </div>

                <p className={"text-left text-destructive"}>
                    {message}
                </p>

            </fieldset>
        </form>
    )
}