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
import {CloudBackup} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export interface UpdateLibrarianDialogProps {
    librarian: LibrarianDetailsReadModel;
}

export function ResetLibrarianPasswordDialog(props: UpdateLibrarianDialogProps) {
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" color="primary" size="sm">
                            <CloudBackup/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Reset password
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <ResetLibrarianPasswordDialogContent {...props} />
            </DialogContent>
        </Dialog>
    )
}

function ResetLibrarianPasswordDialogContent({librarian}: UpdateLibrarianDialogProps) {
    const {data, isSuccess, mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: () => librariansClient.resetPassword(librarian.id).then(x => x.data),
    });

    async function handleClick() {
        await mutateAsync()
    }

    let message: string | undefined;

    if (isSuccess) {
        message = `Successfully reset password, new temporary password: ${data.temporaryPassword}`;
    }

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <div className="contents">
            <DialogHeader>
                <DialogTitle>Reset librarian password</DialogTitle>
            </DialogHeader>

            <DialogDescription>
                Are you sure you want to reset {librarian.firstName} {librarian.lastName} (<a href={`mailto:${librarian.email}`}>{librarian.email}</a>) password?
            </DialogDescription>

            <p className={"text-left text-destructive text-sm"}>
                {message}
            </p>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button disabled={isPending} onClick={handleClick}>Reset Password</Button>
            </DialogFooter>
        </div>
    )
}