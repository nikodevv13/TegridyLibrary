import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import {Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useState} from "react";
import queryClient from "@/clients/shared/queryClient.ts";
import publishersClient from "@/clients/publishers/publishersClients.ts";
import type PublisherReadModel from "@/clients/publishers/models/PublisherReadModel.ts";

export interface DeletePublisherDialogProps {
    publisher: PublisherReadModel;
}

export function DeletePublisherDialog({publisher}: DeletePublisherDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: () => publishersClient.deletePublisher(publisher.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['publishers']})
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
                    Delete publisher
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Delete publisher</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-justify">
                        Are you sure you want to delete `{publisher.name}` publisher?
                        This action cannot be undone.
                    </DialogDescription>

                    <p className={"text-left text-destructive text-sm"}>
                        {message}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={isPending} onClick={handleClick}>Delete publisher</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
