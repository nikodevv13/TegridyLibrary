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
import type CreateGenreRequestBody from "@/clients/genres/models/CreateGenreRequestBody";
import GenreForm, {type GenreFormData} from "@/components/genres/GenreForm.tsx";
import {useState} from "react";
import genresClient from "@/clients/genres/genresClient.ts";

export function CreateGenreDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateGenreRequestBody) => genresClient.createGenre(requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['genres'] })
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
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus/> Add new genre
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create genre</DialogTitle>
                    </DialogHeader>

                    <GenreForm message={message} formId={"genre-form-create"} disabled={isPending} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"genre-form-create"} type="submit" disabled={isPending}>Create genre</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}