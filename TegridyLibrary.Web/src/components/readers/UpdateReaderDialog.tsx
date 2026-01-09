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
import ReaderForm, {type ReaderFormData} from "@/components/readers/ReaderForm.tsx";
import {useState} from "react";
import type ReaderReadModel from "@/clients/readers/models/ReaderReadModel.ts";
import type UpdateReaderRequestBody from "@/clients/readers/models/UpdateReaderRequestBody.ts";
import {TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Tooltip} from "@radix-ui/react-tooltip";
import readersClient from "@/clients/readers/readersClient.ts";

export interface UpdateReaderDialogProps {
    reader: ReaderReadModel
}

export function UpdateReaderDialog({reader}: UpdateReaderDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdateReaderRequestBody) => readersClient.updateReader(reader.id, requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['readers']})
        }
    });

    async function handleSubmit(formData: ReaderFormData) {
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
                    Update reader
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Update reader</DialogTitle>
                    </DialogHeader>

                    <ReaderForm defaultValues={reader} message={message} formId={"reader-form-create"} disabled={isPending}
                                   onSubmit={handleSubmit}/>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"reader-form-create"} type="submit" disabled={isPending}>Update reader</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}