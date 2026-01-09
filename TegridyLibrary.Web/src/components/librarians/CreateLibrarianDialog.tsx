import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import librariansClient from "@/clients/librarians/librariansClient.ts";
import {isAxiosError} from "axios";
import queryClient from "@/clients/shared/queryClient.ts";
import LibrarianForm, {type LibrarianFormData} from "@/components/librarians/LibrarianForm.tsx";
import type CreateLibrarianRequestBody from "@/clients/librarians/models/CreateLibrarianRequestBody.ts";
import {Plus} from "lucide-react";

export function CreateLibrarianDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus/> Add new librarian
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <CreateLibrarianDialogContent/>
            </DialogContent>
        </Dialog>
    )
}

function CreateLibrarianDialogContent() {
    const {isSuccess, data, mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateLibrarianRequestBody) => librariansClient.createLibrarian(requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['librarians'] })
        }
    });

    async function handleSubmit(formData: LibrarianFormData) {
        await mutateAsync(formData)
    }

    let message: string | undefined;

    if (isSuccess) {
        message = `Successfully created librarian, temporary password: ${data.temporaryPassword}`
    }

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <div className="contents">
            <DialogHeader>
                <DialogTitle>Create librarian</DialogTitle>
            </DialogHeader>

            <LibrarianForm message={message} formId={"librarian-form-create"} disabled={isPending} onSubmit={handleSubmit} />

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button form={"librarian-form-create"} type="submit" disabled={isPending}>Create librarian</Button>
            </DialogFooter>
        </div>
    )
}