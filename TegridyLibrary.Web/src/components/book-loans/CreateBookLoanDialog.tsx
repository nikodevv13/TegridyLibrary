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
import {useState} from "react";
import bookLoansClient from "@/clients/book-loans/bookLoansClient.ts";
import type CreateBookLoanRequestBody from "@/clients/book-loans/models/CreateBookLoanRequestBody.ts";
import BookLoanForm, { type BookLoanFormData } from "./BookLoanForm";

export function CreateBookLoanDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string>("");

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: (requestBody: CreateBookLoanRequestBody) => bookLoansClient.createBookLoan(requestBody),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['book-loans'] })
            setIsOpen(false);
        }
    });

    async function handleSubmit(formData: BookLoanFormData) {
        if (!formData.readerId || !formData.bookCopyId) {
            setValidationMessage("Reader and Book copy are required fields")
            return
        }
        await mutateAsync(formData)
        setIsOpen(false);
    }

    let message = validationMessage;

    if (isError) {
        message = (isError && isAxiosError(error) ? error.response!.data.message : '') || "Something went wrong"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus/> Create a book loan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Create bookLoan</DialogTitle>
                    </DialogHeader>

                    <BookLoanForm message={message} formId={"bookLoan-form-create"} disabled={isPending} onSubmit={handleSubmit} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form={"bookLoan-form-create"} type="submit" disabled={isPending}>Create book loan</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}