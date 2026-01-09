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
import {Pencil} from "lucide-react";
import AuthorForm, {type AuthorFormData} from "@/components/authors/AuthorForm.tsx";
import {useState} from "react";
import type AuthorReadModel from "@/clients/authors/models/AuthorReadModel.ts";
import type UpdateAuthorRequestBody from "@/clients/authors/models/UpdateAuthorRequestBody.ts";
import {TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Tooltip} from "@radix-ui/react-tooltip";
import authorsClient from "@/clients/authors/authorsClient.ts";

export interface UpdateAuthorDialogProps {
    author: AuthorReadModel
}

export function UpdateAuthorDialog({author}: UpdateAuthorDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdateAuthorRequestBody) => authorsClient.updateAuthor(author.id, requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['authors']})
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" color="primary" size="sm">
                            <Pencil/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Update author
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Update author</DialogTitle>
                    </DialogHeader>

                    <AuthorForm defaultValues={author} message={message} formId={"author-form-create"} disabled={isPending}
                                   onSubmit={handleSubmit}/>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"author-form-create"} type="submit" disabled={isPending}>Update author</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}