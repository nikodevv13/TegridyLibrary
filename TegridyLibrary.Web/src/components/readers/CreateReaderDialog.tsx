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
import type CreateReaderRequestBody from "@/clients/readers/models/CreateReaderRequestBody";
import {useState} from "react";
import readersClient from "@/clients/readers/readersClient.ts";
import ReaderForm, {type ReaderFormData} from "@/components/readers/ReaderForm.tsx";

export function CreateReaderDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateReaderRequestBody) => readersClient.createReader(requestBody).then(x => x.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['readers'] })
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
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus/> Add new reader
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create reader</DialogTitle>
                    </DialogHeader>

                    <ReaderForm message={message} formId={"reader-form-create"} disabled={isPending} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"reader-form-create"} type="submit" disabled={isPending}>Create reader</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}