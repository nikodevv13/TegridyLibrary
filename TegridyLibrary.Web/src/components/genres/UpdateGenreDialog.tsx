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
import GenreForm, {type GenreFormData} from "@/components/genres/GenreForm.tsx";
import {useState} from "react";
import type GenreReadModel from "@/clients/genres/models/GenreReadModel.ts";
import type UpdateGenreRequestBody from "@/clients/genres/models/UpdateGenreRequestBody.ts";
import {TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Tooltip} from "@radix-ui/react-tooltip";
import genresClient from "@/clients/genres/genresClient.ts";

export interface UpdateGenreDialogProps {
    genre: GenreReadModel
}

export function UpdateGenreDialog({genre}: UpdateGenreDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdateGenreRequestBody) => genresClient.updateGenre(genre.id, requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['genres']})
        }
    });

    async function handleSubmit(formData: GenreFormData) {
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
                    Update genre
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Update genre</DialogTitle>
                    </DialogHeader>

                    <GenreForm defaultValues={genre} message={message} formId={"genre-form-create"} disabled={isPending}
                                   onSubmit={handleSubmit}/>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"genre-form-create"} type="submit" disabled={isPending}>Update genre</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}