import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@tanstack/react-query";
import {isAxiosError} from "axios";
import {BookCheck} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useState} from "react";
import queryClient from "@/clients/shared/queryClient.ts";
import bookLoansClient from "@/clients/book-loans/bookLoansClient.ts";
import type BookLoanReadModel from "@/clients/book-loans/models/BookLoanReadModel.ts";

export interface CompleteBookLoanDialogProps {
    bookLoan: BookLoanReadModel;
}

export function CompleteBookLoanDialog({bookLoan}: CompleteBookLoanDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {mutateAsync, isPending, isError, error} = useMutation({
        mutationFn: () => bookLoansClient.completeBookLoan(bookLoan.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['book-loans']})
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
                            <BookCheck/>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Complete book loan
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <div className="contents">
                    <DialogHeader>
                        <DialogTitle>Complete bookLoan</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-justify">
                        Are you sure you want to complete `{bookLoan.book.inventoryNumber}` book loan?
                    </DialogDescription>

                    <p className={"text-left text-destructive text-sm"}>
                        {message}
                    </p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={isPending} onClick={handleClick}>Complete book loan</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
