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
import publishersClient from "@/clients/publishers/publishersClients.ts";
import PublisherForm, {type PublisherFormData} from "@/components/publishers/PublisherForm.tsx";
import {useState} from "react";
import type PublisherReadModel from "@/clients/publishers/models/PublisherReadModel.ts";
import type UpdatePublisherRequestBody from "@/clients/publishers/models/UpdatePublisherRequestBody.ts";
import {TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Tooltip} from "@radix-ui/react-tooltip";

export interface UpdatePublisherDialogProps {
    publisher: PublisherReadModel
}

export function UpdatePublisherDialog({publisher}: UpdatePublisherDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: UpdatePublisherRequestBody) => publishersClient.updatePublisher(publisher.id, requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['publishers']})
        }
    });

    async function handleSubmit(formData: PublisherFormData) {
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
                    Update publisher
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Update publisher</DialogTitle>
                    </DialogHeader>

                    <PublisherForm defaultValues={publisher} message={message} formId={"publisher-form-create"} disabled={isPending}
                                   onSubmit={handleSubmit}/>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"publisher-form-create"} type="submit" disabled={isPending}>Update publisher</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}