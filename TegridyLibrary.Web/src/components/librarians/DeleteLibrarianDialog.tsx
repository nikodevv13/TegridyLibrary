import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import librariansClient from "@/clients/librarians/librariansClient.ts";
import {isAxiosError} from "axios";
import type LibrarianDetailsReadModel from "@/clients/librarians/models/LibrarianDetailsReadModel.ts";
import {Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useState} from "react";
import queryClient from "@/clients/shared/queryClient.ts";

export interface UpdateLibrarianDialogProps {
    librarian: LibrarianDetailsReadModel;
}

export function DeleteLibrarianDialog({librarian}: UpdateLibrarianDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: () => librariansClient.deleteLibrarian(librarian.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['librarians']})
        }
    });

    async function handleClick() {
        await mutateAsync()
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
                            <Trash2/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Delete librarian
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Delete librarian account</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-justify">
                        Are you sure you want to delete {librarian.firstName} {librarian.lastName} (<a href={`mailto:${librarian.email}`}>{librarian.email}</a>) librarian account?
                        This action cannot be undone.
                    </DialogDescription>

                    <p className={"text-left text-destructive text-sm"}>
                        {message}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={isPending} onClick={handleClick}>Delete librarian</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
