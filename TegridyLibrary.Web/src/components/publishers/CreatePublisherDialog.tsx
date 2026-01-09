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
import type CreatePublisherRequestBody from "@/clients/publishers/models/CreatePublisherRequestBody";
import publishersClient from "@/clients/publishers/publishersClients.ts";
import PublisherForm, {type PublisherFormData} from "@/components/publishers/PublisherForm.tsx";
import {useState} from "react";

export function CreatePublisherDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreatePublisherRequestBody) => publishersClient.createPublisher(requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['publishers'] })
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
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus/> Add new publisher
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create publisher</DialogTitle>
                    </DialogHeader>

                    <PublisherForm message={message} formId={"publisher-form-create"} disabled={isPending} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"publisher-form-create"} type="submit" disabled={isPending}>Create publisher</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}