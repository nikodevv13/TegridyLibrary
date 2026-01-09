import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import queryClient from "@/clients/shared/queryClient.ts";
import {Plus} from "lucide-react";
import type CreateAuthorRequestBody from "@/clients/authors/models/CreateAuthorRequestBody";
import {useState} from "react";
import authorsClient from "@/clients/authors/authorsClient.ts";
import AuthorForm, {type AuthorFormData} from "@/components/authors/AuthorForm.tsx";

export function CreateAuthorDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateAuthorRequestBody) => authorsClient.createAuthor(requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['authors'] })
        }
    });

    async function handleSubmit(formData: AuthorFormData) {
        await mutateAsync(formData)
        setIsOpen(false);
    }

    let message: string | undefined;

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus/> Add new author
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create author</DialogTitle>
                    </DialogHeader>

                    <AuthorForm message={message} formId={"author-form-create"} disabled={isPending} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"author-form-create"} type="submit" disabled={isPending}>Create author</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}