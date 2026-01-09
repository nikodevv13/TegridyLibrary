import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import librariansClient from "@/clients/librarians/librariansClient.ts";
import {isAxiosError} from "axios";
import type UpdateLibrarianRequestBody from "@/clients/librarians/models/UpdateLibrarianRequestBody.ts";
import queryClient from "@/clients/shared/queryClient.ts";
import {Pencil} from "lucide-react";
import LibrarianForm, {type LibrarianFormData} from "@/components/librarians/LibrarianForm.tsx";
import type LibrarianDetailsReadModel from "@/clients/librarians/models/LibrarianDetailsReadModel.ts";
import useApp from "@/hooks/useApp.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export interface UpdateLibrarianDialogProps {
    librarian: LibrarianDetailsReadModel;
}

export function UpdateLibrarianDialog(props: UpdateLibrarianDialogProps) {
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" color="primary" size="sm">
                            <><Pencil/></>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Update librarian
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <UpdateLibrarianDialogContent {...props} />
            </DialogContent>
        </Dialog>
    )
}

function UpdateLibrarianDialogContent({librarian}: UpdateLibrarianDialogProps) {
    const app = useApp();
    const {isSuccess, mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdateLibrarianRequestBody) => librariansClient.updateLibrarian(librarian.id, requestBody),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['librarians']})
            if (librarian.id === app.librarian!.id) {
                app.verifyLocalSession();
            }
        }
    });

    async function handleSubmit(formData: LibrarianFormData) {
        await mutateAsync(formData)
    }

    let message: string | undefined;

    if (isSuccess) {
        message = "Successfully updated librarian"
    }

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <div className="contents">
            <DialogHeader>
                <DialogTitle>Update librarian</DialogTitle>
            </DialogHeader>

            <LibrarianForm message={message} defaultValues={librarian} formId={"librarian-form-update"}
                           disabled={isPending} onSubmit={handleSubmit}/>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button form={"librarian-form-update"} type="submit" disabled={isPending}>Update librarian</Button>
            </DialogFooter>
        </div>
    )
}