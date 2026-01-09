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
import type GenreReadModel from "@/clients/genres/models/GenreReadModel.ts";
import genresClient from "@/clients/genres/genresClient.ts";

export interface DeleteGenreDialogProps {
    genre: GenreReadModel;
}

export function DeleteGenreDialog({genre}: DeleteGenreDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: () => genresClient.deleteGenre(genre.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['genres']})
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
                    Delete genre
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Delete genre</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-justify">
                        Are you sure you want to delete `{genre.name}` genre?
                        This action cannot be undone.
                    </DialogDescription>

                    <p className={"text-left text-destructive text-sm"}>
                        {message}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={isPending} onClick={handleClick}>Delete genre</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
